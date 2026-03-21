// api/save-tracking.js

import { connectToDatabase } from './utils/dbConnect';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'http://localhost:3000'); // ✅
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const trackingData = req.body;

    if (!trackingData.userId || !trackingData.contentId || !trackingData.contentType) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();

    const incomingDims = trackingData.containerDimensions || {};
    const positions    = trackingData.mousePositions || [];

    // ── Auto-detekcia storageFormat ──────────────────────────────────────────
    let detectedFormat = incomingDims.storageFormat;
    if (!detectedFormat || detectedFormat === 'unknown') {
      if (positions.length > 0) {
        // ✅ Medián z prvých 10 vzoriek — konzistentné s get-tracking-by-component.js
        const sampleSlice = positions.slice(0, 10);
        const medianX = [...sampleSlice.map(p => p.x)].sort((a, b) => a - b)[Math.floor(sampleSlice.length / 2)];
        const medianY = [...sampleSlice.map(p => p.y)].sort((a, b) => a - b)[Math.floor(sampleSlice.length / 2)];

        if      (medianX <= 1.0  && medianY <= 1.0)  detectedFormat = 'normalized_0_1';
        else if (medianX <= 100  && medianY <= 100)   detectedFormat = 'percent';
        else                                           detectedFormat = 'pixels';

        console.log(`🔍 Auto-detected storageFormat: ${detectedFormat} (median x=${medianX}, y=${medianY})`);
      } else {
        detectedFormat = 'percent';
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    const containerDimensions = {
      ...incomingDims,
      storageFormat:  detectedFormat,
      originalWidth:  incomingDims.originalWidth  || incomingDims.width  || null,
      originalHeight: incomingDims.originalHeight || incomingDims.height || null,
    };

    const movementAnalysis = analyzeMouseMovement(positions, containerDimensions); // ✅ predaj dims

    const trackingRecord = {
      userId:      trackingData.userId,
      contentId:   trackingData.contentId,
      contentType: trackingData.contentType,
      timestamp:   new Date(),
      timeSpent:   trackingData.timeSpent || 0,
      hoverMetrics: {
        totalHoverTime: trackingData.totalHoverTime || trackingData.timeSpent || 0,
        hoverStartTime: trackingData.hoverStartTime,
      },
      mousePositions:  positions,
      movementAnalysis,
      cloudinaryData:  null,
      containerDimensions,
      landmarks:       trackingData.landmarks || [],
      isMobile:        trackingData.isMobile  || false,
    };

    const result = await db.collection('hover_tracking').insertOne(trackingRecord);

    console.log('✅ Tracking data saved:', {
      trackingId:     result.insertedId.toString(),
      userId:         trackingData.userId,
      contentId:      trackingData.contentId,
      mousePositions: positions.length,
      landmarks:      trackingData.landmarks?.length || 0,
      timeSpent:      trackingRecord.timeSpent,
      storageFormat:  containerDimensions.storageFormat,
    });

    return res.status(200).json({
      success:    true,
      trackingId: result.insertedId.toString(),
      message:    'Tracking data saved successfully',
    });

  } catch (error) {
    console.error('❌ Save tracking error:', error);
    return res.status(500).json({
      success: false,
      error:   'Internal server error',
      message: error.message,
    });
  }
}

function analyzeMouseMovement(positions, containerDimensions = {}) { // ✅ prijíma dims
  if (!positions || positions.length === 0) {
    return {
      totalDistance:    0,
      averageSpeed:     0,
      maxSpeed:         0,
      directionChanges: 0,
      positionsCount:   0,
      unit:             'percent',
    };
  }

  let totalDistance    = 0;
  let maxSpeed         = 0;
  let directionChanges = 0;
  let prevDirection    = null;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    const dx       = curr.x - prev.x;
    const dy       = curr.y - prev.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    totalDistance += distance;

    const timeDiff = (curr.timestamp - prev.timestamp) / 1000;
    if (timeDiff > 0) {
      const speed = distance / timeDiff;
      maxSpeed = Math.max(maxSpeed, speed);
    }

    const direction = Math.atan2(dy, dx);
    if (prevDirection !== null) {
      const angleDiff = Math.abs(direction - prevDirection);
      if (angleDiff > Math.PI / 4) directionChanges++;
    }
    prevDirection = direction;
  }

  const totalTime    = (positions[positions.length - 1].timestamp - positions[0].timestamp) / 1000;
  const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0;

  return {
    totalDistance:    Math.round(totalDistance),
    averageSpeed:     Math.round(averageSpeed),
    maxSpeed:         Math.round(maxSpeed),
    directionChanges,
    positionsCount:   positions.length,
    unit:             containerDimensions.storageFormat === 'percent' ? 'percent' : 'pixels', // ✅
  };
}
