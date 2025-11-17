// api/save-tracking.js
// OPRAVENÁ VERZIA - Ukladá PNG obrázky namiesto HTML

import { MongoClient } from 'mongodb';

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

function analyzeMouseMovement(positions) {
  if (!positions || positions.length < 2) {
    return {
      pattern: 'insufficient_data',
      averageSpeed: 0,
      totalPoints: 0,
    };
  }

  let horizontalMovements = 0;
  let verticalMovements = 0;
  let totalSpeed = 0;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    const deltaX = Math.abs(curr.x - prev.x);
    const deltaY = Math.abs(curr.y - prev.y);
    const deltaTime = curr.timestamp - prev.timestamp;

    if (deltaX > deltaY * 1.5) horizontalMovements++;
    if (deltaY > deltaX * 1.5) verticalMovements++;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const speed = deltaTime > 0 ? distance / deltaTime : 0;
    totalSpeed += speed;
  }

  const avgSpeed = totalSpeed / (positions.length - 1);
  
  let pattern = 'mixed';
  if (horizontalMovements > verticalMovements * 2) {
    pattern = 'horizontal_reading';
  } else if (verticalMovements > horizontalMovements * 2) {
    pattern = 'vertical_scanning';
  }

  return {
    pattern,
    averageSpeed: Math.round(avgSpeed * 1000) / 1000,
    totalPoints: positions.length,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const trackingData = req.body;

    console.log('📥 Received tracking data for:', trackingData.contentId);

    // Analýza pohybu myši
    const movementAnalysis = analyzeMouseMovement(trackingData.mousePositions || []);

    // ✅ Uloženie do MongoDB (BEZ cloudinaryData - to sa pridá neskôr)
    const client = await connectToDatabase();
    const db = client.db('conspiracy');
    
    const trackingRecord = {
      userId: trackingData.userId,
      contentId: trackingData.contentId,
      contentType: trackingData.contentType,
      timestamp: new Date(),
      hoverMetrics: {
        totalHoverTime: trackingData.totalHoverTime || 0,
        hoverStartTime: trackingData.hoverStartTime,
      },
      mousePositions: trackingData.mousePositions || [],
      movementAnalysis,
      cloudinaryData: null, // ✅ Bude aktualizované neskôr cez update-tracking-cloudinary
      containerDimensions: trackingData.containerDimensions,
      isMobile: trackingData.isMobile || false,
    };

    const result = await db.collection('hover_tracking').insertOne(trackingRecord);

    console.log('✅ MongoDB save successful:', result.insertedId);

    return res.status(200).json({
      success: true,
      trackingId: result.insertedId.toString(),
      message: 'Tracking data saved'
    });

  } catch (error) {
    console.error('❌ Function error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
