// api/utils/dbConnect.js
import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

const MONGODB_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export async function connectToDatabase() {
  // Ak máme cached connection, vráť ho
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI, MONGODB_OPTIONS);
    await client.connect();
    
    const db = client.db('conspiracy');
    
    cachedClient = client;
    cachedDb = db;
    
    console.log('✅ MongoDB connected');
    
    return { client, db };
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function ensureIndexes(db) {
  try {
    const collection = db.collection('hover_tracking');
    
    // Indexy pre rýchlejšie queries
    await collection.createIndex(
      { contentId: 1, contentType: 1, timestamp: -1 },
      { background: true, name: 'content_composite' }
    );
    
    await collection.createIndex(
      { userId: 1, timestamp: -1 },
      { background: true, name: 'user_time' }
    );
    
    await collection.createIndex(
      { contentType: 1, createdAt: -1 },
      { background: true, name: 'type_created' }
    );
    
    console.log('✅ Indexes ensured');
    
  } catch (error) {
    // Indexy môžu už existovať, nie je to kritická chyba
    console.warn('⚠️ Index creation warning:', error.message);
  }
}
