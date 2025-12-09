import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    const db = cachedClient.db('conspiracy');
    return { client: cachedClient, db };
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
  const db = client.db('conspiracy');
  
  return { client, db };
}

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
    const collections = await db.listCollections({ name: 'hover_tracking' }).toArray();
    
    if (collections.length === 0) {
      return res.status(200).json({
        success: true,
        components: [],
        total: 0,
        stats: {
          totalRecords: 0,
          totalUsers: 0,
          totalPositions: 0
        },
        _meta: {
          message: 'No tracking data yet',
          generatedAt: new Date().toISOString()
        }
      });
    }

    const aggregation = await db.collection('hover_tracking').aggregate([
      {
        $group: {
          _id: {
            contentId: '$contentId',
            contentType: '$contentType'
          },
          usersCount: { $addToSet: '$userId' },
          totalPoints: { 
            $sum: { 
              $cond: [
                { $isArray: '$mousePositions' },
                { $size: '$mousePositions' },
                0
              ]
            }
          },
          avgHoverTime: { 
            $avg: { 
              $ifNull: ['$hoverMetrics.totalHoverTime', 0] 
            } 
          },
          recordsCount: { $sum: 1 },
          lastUpdated: { $max: '$timestamp' },
          visualizations: { 
            $push: {
              $cond: [
                { 
                  $and: [
                    { $ne: ['$cloudinaryData', null] },
                    { $ne: ['$cloudinaryData.url', null] }
                  ]
                },
                '$cloudinaryData.url',
                '$$REMOVE'
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          contentId: '$_id.contentId',
          contentType: '$_id.contentType',
          usersCount: { $size: '$usersCount' },
          totalPoints: 1,
          avgHoverTime: { 
            $round: [
              { $ifNull: ['$avgHoverTime', 0] }, 
              0
            ] 
          },
          recordsCount: 1,
          lastUpdated: 1,
          visualizationsCount: { 
            $size: { $ifNull: ['$visualizations', []] } 
          },
          latestVisualization: { 
            $arrayElemAt: [
              { $ifNull: ['$visualizations', []] }, 
              -1
            ] 
          }
        }
      },
      { 
        $sort: { recordsCount: -1, lastUpdated: -1 } 
      },
      {
        $limit: 100
      }
    ]).toArray();

    const statsResult = await db.collection('hover_tracking').aggregate([
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

    const stats = statsResult[0] || {
      totalRecords: 0,
      totalUsers: 0,
      totalPositions: 0
    };

    return res.status(200).json({
      success: true,
      components: aggregation,
      total: aggregation.length,
      stats,
      _meta: {
        generatedAt: new Date().toISOString(),
        limit: 100
      }
    });

  } catch (error) {
    console.error('❌ Admin tracking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
