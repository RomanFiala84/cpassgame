import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { contentId, contentType } = req.query;

    if (!contentId || !contentType) {
      return res.status(400).json({ success: false, error: 'Missing contentId or contentType' });
    }

    const client = await connectToDatabase();
    const db = client.db('conspiracy');

    const records = await db.collection('hover_tracking')
      .find({ contentId, contentType })
      .toArray();

    if (records.length === 0) {
      return res.status(200).json({ success: false, error: 'No tracking data found for this component' });
    }

    console.log(`✅ Found ${records.length} tracking records for ${contentId}`);

    const aggregatedPositions = [];
    const users = new Set();
    let totalHoverTime = 0;
    let totalTimeSpent = 0;
    let componentTemplateUrl = null;
    let containerDimensions = null;
    let aggregatedLandmarks = [];

    records.forEach(record => {
      if (record.mousePositions && Array.isArray(record.mousePositions)) {
        aggregatedPositions.push(...record.mousePositions);
      }
      users.add(record.userId);
      totalHoverTime += record.hoverMetrics?.totalHoverTime || 0;
      totalTimeSpent += record.timeSpent || 0;

      if (record.landmarks && record.landmarks.length > 0 && aggregatedLandmarks.length === 0) {
        aggregatedLandmarks = record.landmarks;
      }
      if (record.containerDimensions) {
        if (!containerDimensions || record.containerDimensions.storageFormat) {
          containerDimensions = record.containerDimensions;
        }
      }
    });

    let finalContainerDimensions = containerDimensions || {};

    // ── Auto-detekcia storageFormat ──────────────────────────────────────────
    if (!finalContainerDimensions.storageFormat || finalContainerDimensions.storageFormat === 'unknown') {
      if (aggregatedPositions.length > 0) {
        const sample = aggregatedPositions[0];
        // 0.0–1.0 → starý normalized formát
        // 1.0–100 → nový percent formát
        // >100    → pixely
        let detectedFormat;
        if (sample.x <= 1.0 && sample.y <= 1.0) {
          detectedFormat = 'normalized_0_1';
        } else if (sample.x <= 100 && sample.y <= 100) {
          detectedFormat = 'percent';
        } else {
          detectedFormat = 'pixels';
        }
        finalContainerDimensions = { ...finalContainerDimensions, storageFormat: detectedFormat };
        console.log(`🔍 Auto-detected storageFormat: ${detectedFormat} (sample x=${sample.x}, y=${sample.y})`);
      } else {
        finalContainerDimensions = { ...finalContainerDimensions, storageFormat: 'percent' };
      }
    }

    // Ak je starý formát 0.0–1.0, konvertuj na 0–100 priamo tu v backende
    if (finalContainerDimensions.storageFormat === 'normalized_0_1') {
      for (let i = 0; i < aggregatedPositions.length; i++) {
        aggregatedPositions[i] = {
          ...aggregatedPositions[i],
          x: Number((aggregatedPositions[i].x * 100).toFixed(4)),
          y: Number((aggregatedPositions[i].y * 100).toFixed(4)),
        };
      }
      aggregatedLandmarks = aggregatedLandmarks.map(l => ({
        ...l,
        position: {
          top:    Number((l.position.top    * 100).toFixed(4)),
          left:   Number((l.position.left   * 100).toFixed(4)),
          width:  Number((l.position.width  * 100).toFixed(4)),
          height: Number((l.position.height * 100).toFixed(4)),
        }
      }));
      // Po konverzii nastav na 'percent' aby frontend vedel čo dostáva
      finalContainerDimensions = { ...finalContainerDimensions, storageFormat: 'percent' };
      console.log('🔄 Converted normalized_0_1 → percent in backend');
    }
    // ────────────────────────────────────────────────────────────────────────

    if (!finalContainerDimensions.originalWidth) {
      finalContainerDimensions.originalWidth  = 1920;
      finalContainerDimensions.originalHeight = finalContainerDimensions.originalHeight || 2000;
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const templatePublicId = `conspiracy-app/component-templates/template_${contentId}`;
      componentTemplateUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${templatePublicId}.png`;
    } else {
      console.warn('⚠️ CLOUDINARY_CLOUD_NAME not set, no template URL');
    }

    const avgHoverTime = records.length > 0 ? totalHoverTime / records.length : 0;
    const avgTimeSpent = records.length > 0 ? totalTimeSpent / records.length : 0;

    console.log('📊 Aggregated data:', {
      contentId,
      positions: aggregatedPositions.length,
      users: users.size,
      landmarks: aggregatedLandmarks.length,
      containerDimensions: finalContainerDimensions,
    });

    return res.status(200).json({
      success: true,
      data: {
        contentId,
        contentType,
        aggregatedPositions,
        totalPositions: aggregatedPositions.length,
        usersCount: users.size,
        recordsCount: records.length,
        totalHoverTime,
        avgHoverTime,
        avgTimeSpent,
        componentTemplateUrl,
        containerDimensions: finalContainerDimensions,
        landmarks: aggregatedLandmarks,
      }
    });

  } catch (error) {
    console.error('❌ Get tracking by component error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
}
