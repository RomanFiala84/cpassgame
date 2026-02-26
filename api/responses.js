// api/responses.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const getConnection = (() => {
  let cachedClient = null;
  return async () => {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return cachedClient;
  };
})();

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { adminCode, deleteAll } = req.body;

    if (!adminCode || adminCode !== 'RF9846') {
      console.log(`❌ Unauthorized delete attempt: ${adminCode}`);
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!deleteAll) {
      return res.status(400).json({ error: 'Missing deleteAll flag' });
    }

    const client = await getConnection();
    const db = client.db('conspiracy');
    const col = db.collection('participants');

    // Vymaž všetky responses fieldy
    const result = await col.updateMany(
      {},
      { $set: { responses: {}, updatedAt: new Date() } }
    );

    console.log(`🗑️ Vymazané responses pre ${result.modifiedCount} účastníkov`);
    
    return res.status(200).json({ 
      success: true, 
      modifiedCount: result.modifiedCount,
      message: `Responses vymazané pre ${result.modifiedCount} účastníkov`
    });

  } catch (error) {
    console.error('❌ DELETE responses error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}
