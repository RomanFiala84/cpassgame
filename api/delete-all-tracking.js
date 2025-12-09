import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
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
  
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { adminCode } = req.body;

    if (adminCode !== 'RF9846') {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }

    const client = await connectToDatabase();
    const db = client.db('conspiracy');

    const result = await db.collection('hover_tracking').deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} tracking records`);

    return res.status(200).json({
      success: true,
      deleted: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} tracking records`
    });

  } catch (error) {
    console.error('❌ Delete tracking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
