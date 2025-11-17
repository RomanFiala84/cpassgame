// api/admin-tracking-components.js
// OPTIMALIZOVANÁ VERZIA - Pure MongoDB agregácia

import { connectToDatabase, ensureIndexes } from './utils/dbConnect';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { db } = await connectToDatabase();
    await ensureIndexes(db);

    // ✅ OPTIMALIZOVANÁ AGREGÁCIA - Všetko na DB level
    const aggregation = await db.collection('hover_tracking').aggregate([
      // Stage 1: Group by component
      {
        $group: {
          _id: {
            contentId: '$contentId',
            contentType: '$contentType'
          },
          usersCount: { $addToSet: '$userId' },
          // ✅ Počítaj pozície bez ich načítania
          totalPoints: { 
            $sum: { 
              $cond: [
                { $isArray: '$mousePositions' },
                { $size: '$mousePositions' },
                0
              ]
            }
          },
          avgHoverTime: { $avg: '$hoverMetrics.totalHoverTime' },
          recordsCount: { $sum: 1 },
          lastUpdated: { $max: '$timestamp' },
          visualizations: { 
            $push: {
              $cond: [
                { $ne: ['$cloudinaryData.url', null] },
                '$cloudinaryData.url',
                '$$REMOVE'
              ]
            }
          }
        }
      },
      // Stage 2: Project finálnu štruktúru
      {
        $project: {
          _id: 0,
          contentId: '$_id.contentId',
          contentType: '$_id.contentType',
          usersCount: { $size: '$usersCount' },
          totalPoints: 1,
          avgHoverTime: { $round: ['$avgHoverTime', 0] },
          recordsCount: 1,
          lastUpdated: 1,
          visualizationsCount: { $size: '$visualizations' },
          latestVisualization: { $arrayElemAt: ['$visualizations', -1] }
        }
      },
      // Stage 3: Sort by popularity
      { 
        $sort: { recordsCount: -1, lastUpdated: -1 } 
      },
      // Stage 4: Limit pre performance
      {
        $limit: 100
      }
    ]).toArray();

    // Štatistiky
    const stats = await db.collection('hover_tracking').aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalUsers: { $addToSet: '$userId' },
          totalPositions: { 
            $sum: { 
              $cond: [
                { $isArray: '$mousePositions' },
                { $size: '$mousePositions' },
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalRecords: 1,
          totalUsers: { $size: '$totalUsers' },
          totalPositions: 1
        }
      }
    ]).toArray();

    return res.status(200).json({
      success: true,
      components: aggregation,
      total: aggregation.length,
      stats: stats[0] || {
        totalRecords: 0,
        totalUsers: 0,
        totalPositions: 0
      },
      _meta: {
        generatedAt: new Date().toISOString(),
        limit: 100
      }
    });

  } catch (error) {
    console.error('❌ Admin tracking components error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
