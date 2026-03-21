// api/admin-tracking-components.js

import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    try {
      await cachedClient.db('admin').command({ ping: 1 }); // ✅ over živosť spojenia
      return { client: cachedClient, db: cachedClient.db('conspiracy') };
    } catch {
      cachedClient = null; // ✅ resetni mŕtve spojenie
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not configured');
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });

  await client.connect();
  cachedClient = client;

  return { client, db: client.db('conspiracy') };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'http://localhost:3000'); // ✅ nie wildcard
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    const { contentId } = req.query;

    const collections = await db.listCollections({ name: 'hover_tracking' }).toArray();

    if (collections.length === 0) {
      return res.status(200).json({
        success: true,
        interventions: [],
        total: 0,
        stats: { totalRecords: 0, totalUsers: 0, totalPositions: 0 },
        _meta: { message: 'No tracking data yet', generatedAt: new Date().toISOString() },
      });
    }

    const firstMatch = { contentType: 'intervention' };
    if (contentId) firstMatch.contentId = contentId;

    const aggregation = await db.collection('hover_tracking').aggregate([
      { $match: firstMatch },
      {
        $group: {
          _id: '$contentId',
          usersCount:   { $addToSet: '$userId' },
          totalPoints: {
            $sum: {
              $cond: [{ $isArray: '$mousePositions' }, { $size: '$mousePositions' }, 0],
            },
          },
          avgTimeSpent: { $avg: { $ifNull: ['$timeSpent', 0] } },
          recordsCount: { $sum: 1 },
          lastUpdated:  { $max: '$timestamp' },
          visualizations: {
            $push: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$cloudinaryData',      null] },
                    { $ne: ['$cloudinaryData.url',  null] },
                  ],
                },
                '$cloudinaryData.url',
                '$$REMOVE',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id:          0,
          contentId:    '$_id',
          contentType:  { $literal: 'intervention' },
          usersCount:   { $size: '$usersCount' },
          totalPoints:  1,
          avgTimeSpent: { $round: [{ $ifNull: ['$avgTimeSpent', 0] }, 0] },
          recordsCount: 1,
          lastUpdated:  1,
          visualizationsCount: { $size: { $ifNull: ['$visualizations', []] } },
          latestVisualization: {
            $arrayElemAt: [{ $ifNull: ['$visualizations', []] }, -1],
          },
        },
      },
      { $sort: { contentId: 1 } },
    ]).toArray();

    const statsResult = await db.collection('hover_tracking').aggregate([
      { $match: { contentType: 'intervention' } },
      {
        $group: {
          _id:            null,
          totalRecords:   { $sum: 1 },
          totalUsers:     { $addToSet: '$userId' },
          totalPositions: {
            $sum: {
              $cond: [{ $isArray: '$mousePositions' }, { $size: '$mousePositions' }, 0],
            },
          },
          avgTimeSpent: { $avg: { $ifNull: ['$timeSpent', 0] } },
        },
      },
      {
        $project: {
          _id:            0,
          totalRecords:   1,
          totalUsers:     { $size: '$totalUsers' },
          totalPositions: 1,
          avgTimeSpent:   { $round: [{ $ifNull: ['$avgTimeSpent', 0] }, 0] },
        },
      },
    ]).toArray();

    return res.status(200).json({
      success:       true,
      interventions: aggregation,
      total:         aggregation.length,
      stats: statsResult[0] || {
        totalRecords:   0,
        totalUsers:     0,
        totalPositions: 0,
        avgTimeSpent:   0,
      },
      _meta: {
        generatedAt:   new Date().toISOString(),
        appliedFilter: contentId || null,
      },
    });

  } catch (error) {
    console.error('❌ Admin tracking error:', error);
    return res.status(500).json({
      success: false,
      error:   'Internal server error',
      message: error.message,
      stack:   process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
