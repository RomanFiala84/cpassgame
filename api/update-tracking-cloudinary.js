// api/update-tracking-cloudinary.js

import { MongoClient, ObjectId } from 'mongodb';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { trackingId, cloudinaryData } = req.body;

    if (!trackingId || !cloudinaryData) {
      return res.status(400).json({ success: false, error: 'Missing trackingId or cloudinaryData' });
    }

    // ✅ Validuj formát pred ObjectId konverziou
    if (!ObjectId.isValid(trackingId)) {
      return res.status(400).json({ success: false, error: 'Invalid trackingId format' });
    }

    const { db } = await connectToDatabase(); // ✅ destructuring

    const result = await db.collection('hover_tracking').updateOne(
      { _id: new ObjectId(trackingId) },
      {
        $set: {
          cloudinaryData,
          cloudinaryUpdatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Tracking record not found' });
    }

    console.log(`✅ Updated tracking ${trackingId} with Cloudinary data`);

    return res.status(200).json({
      success:  true,
      modified: result.modifiedCount,
    });

  } catch (error) {
    console.error('❌ Update tracking Cloudinary error:', error);
    return res.status(500).json({
      success: false,
      error:   'Internal server error',
      message: error.message,
    });
  }
}
