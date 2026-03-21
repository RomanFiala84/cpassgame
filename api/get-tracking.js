// api/get-tracking.js

import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    try {
      await cachedClient.db('admin').command({ ping: 1 }); // ✅
      return { client: cachedClient, db: cachedClient.db('conspiracy') };
    } catch {
      cachedClient = null;
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
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'http://localhost:3000'); // ✅
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contentType, userId } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200); // ✅ clamp

    const { db } = await connectToDatabase(); // ✅ destructuring

    const query = {};
    if (contentType) query.contentType = contentType;
    if (userId)      query.userId      = userId;

    // ✅ Paralelne — rýchlejšie ako dve sekvenčné awaity
    const [data, total] = await Promise.all([
      db.collection('hover_tracking')
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray(),
      db.collection('hover_tracking')
        .countDocuments(query),  // ✅ skutočný celkový počet
    ]);

    return res.status(200).json({
      success: true,
      data,
      total,          // ✅ celkový počet v DB
      returned: data.length, // ✅ koľko sa vrátilo (môže byť < total)
      limit,
    });

  } catch (error) {
    console.error('❌ Function error:', error);
    return res.status(500).json({ error: error.message });
  }
}
