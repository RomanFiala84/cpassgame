// api/update-tracking-cloudinary.js
import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { trackingId, cloudinaryData } = req.body;

    if (!trackingId || !cloudinaryData) {
      return res.status(400).json({ success: false, error: 'Missing trackingId or cloudinaryData' });
    }

    const client = await connectToDatabase();
    const db = client.db('conspiracy');

    const result = await db.collection('hover_tracking').updateOne(
      { _id: new ObjectId(trackingId) },
      { 
        $set: { 
          cloudinaryData: cloudinaryData,
          cloudinaryUpdatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Tracking record not found' });
    }

    console.log(`✅ Updated tracking ${trackingId} with Cloudinary data`);

    return res.status(200).json({
      success: true,
      modified: result.modifiedCount
    });

  } catch (error) {
    console.error('Update tracking Cloudinary error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
