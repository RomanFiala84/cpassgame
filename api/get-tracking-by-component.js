// api/get-tracking-by-component.js

import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    try {
      await cachedClient.db('admin').command({ ping: 1 });
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

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Detekuje format pozícií z reprezentatívnej vzorky (každý n-tý bod, max 20).
 * Vracia: 'normalized_0_1' | 'percent' | 'pixels' | null
 */
function detectFormat(positions) {
  if (!positions || positions.length === 0) return null;

  const step   = Math.max(1, Math.floor(positions.length / 20));
  const sample = positions.filter((_, i) => i % step === 0).slice(0, 20);
  const xs     = sample.map(p => p.x).sort((a, b) => a - b);
  const ys     = sample.map(p => p.y).sort((a, b) => a - b);
  const maxX   = xs[xs.length - 1];
  const maxY   = ys[ys.length - 1];
  const midX   = xs[Math.floor(xs.length / 2)];
  const midY   = ys[Math.floor(ys.length / 2)];

  if (midX <= 1.0 && midY <= 1.0 && maxX <= 1.05 && maxY <= 1.05) return 'normalized_0_1';
  if (midX <= 100 && maxX <= 105)                                   return 'percent';
  return 'pixels';
}

/**
 * Normalizuje pozície záznamu na percent (0–100).
 * FIX: každý záznam má vlastný originalHeight → musíme škálovať jeho pozície
 * individuálne pred agregáciou, nie mixovať rôzne výšky dohromady.
 *
 * Ak storageFormat === 'percent', pozície sú už relatívne k vlastnému
 * originalHeight → priamo použiteľné bez konverzie.
 *
 * Ak storageFormat === 'normalized_0_1' → vynásobiť * 100.
 * Ak storageFormat === 'pixels' → vydeliť originalWidth/originalHeight * 100.
 */
function normalizeRecordPositions(positions, dims) {
  if (!positions || positions.length === 0) return [];

  const fmt = dims?.storageFormat || detectFormat(positions);

  if (fmt === 'percent') {
    // Clamp záporné hodnoty (artefakty z pohybu mimo kontajner)
    return positions.map(p => ({
      x: Math.max(0, Math.min(100, p.x)),
      y: Math.max(0, p.y),             // y môže byť > 100 pri dlhých stránkach — OK
    }));
  }

  if (fmt === 'normalized_0_1') {
    return positions.map(p => ({
      x: Math.max(0, Math.min(100, p.x * 100)),
      y: Math.max(0, p.y * 100),
    }));
  }

  if (fmt === 'pixels') {
    const w = dims?.originalWidth  || 1920;
    const h = dims?.originalHeight || 2000;
    return positions.map(p => ({
      x: Math.max(0, Math.min(100, (p.x / w) * 100)),
      y: Math.max(0, (p.y / h) * 100),
    }));
  }

  // Fallback — vráť as-is, frontend si poradí
  return positions;
}

/**
 * Normalizuje landmarks záznamu na percent.
 */
function normalizeLandmarks(landmarks, dims) {
  if (!landmarks || landmarks.length === 0) return [];

  const fmt = dims?.storageFormat || 'percent';

  if (fmt === 'normalized_0_1') {
    return landmarks.map(l => ({
      ...l,
      position: {
        top:    Math.max(0, l.position.top    * 100),
        left:   Math.max(0, l.position.left   * 100),
        width:  l.position.width  * 100,
        height: l.position.height * 100,
      },
    }));
  }

  if (fmt === 'pixels') {
    const w = dims?.originalWidth  || 1920;
    const h = dims?.originalHeight || 2000;
    return landmarks.map(l => ({
      ...l,
      position: {
        top:    Math.max(0, (l.position.top    / h) * 100),
        left:   Math.max(0, (l.position.left   / w) * 100),
        width:  (l.position.width  / w) * 100,
        height: (l.position.height / h) * 100,
      },
    }));
  }

  // percent — clamp
  return landmarks.map(l => ({
    ...l,
    position: {
      top:    Math.max(0, l.position.top),
      left:   Math.max(0, l.position.left),
      width:  l.position.width,
      height: l.position.height,
    },
  }));
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || 'http://localhost:3000');
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

    const { db } = await connectToDatabase();

    const records = await db.collection('hover_tracking')
      .find({ contentId, contentType })
      .toArray();

    if (records.length === 0) {
      return res.status(200).json({ success: false, error: 'No tracking data found for this component' });
    }

    console.log(`✅ Found ${records.length} tracking records for ${contentId}`);

    // ── FIX: Každý záznam normalizujeme individuálne pred agregáciou ─────────
    // Dôvod: rôzni používatelia mohli mať rôzne originalHeight (rôzne rozlíšenia,
    // rôzna výška obsahu). Mixovať surové pixely/percenty bez normalizácie by
    // dávalo nesprávne polohy v heatmape.
    const aggregatedPositions = [];
    const aggregatedLandmarks = [];
    const users               = new Set();
    let   totalHoverTime      = 0;
    let   totalTimeSpent      = 0;

    // Pre containerDimensions berieme záznam s najväčšou originalHeight
    // (najdlhšia stránka = najreprezentatívnejší canvas pre overlay)
    let bestDims = null;

    records.forEach(record => {
      const dims = record.containerDimensions || {};

      // Sleduj najväčšiu originalHeight pre výsledný canvas
      const recHeight = dims.originalHeight || 0;
      if (!bestDims || recHeight > (bestDims.originalHeight || 0)) {
        bestDims = dims;
      }

      // Normalizuj pozície tohto záznamu na percent individuálne
      const normalizedPositions = normalizeRecordPositions(
        record.mousePositions || [],
        dims,
      );
      aggregatedPositions.push(...normalizedPositions);

      users.add(record.userId);
      totalHoverTime += record.hoverMetrics?.totalHoverTime || 0;
      totalTimeSpent += record.timeSpent                    || 0;
    });

    // Landmarks z najnovšieho záznamu ktorý ich má (normalizované)
    const latestWithLandmarks = [...records]
      .reverse()
      .find(r => r.landmarks && r.landmarks.length > 0);

    if (latestWithLandmarks) {
      const normalizedLandmarks = normalizeLandmarks(
        latestWithLandmarks.landmarks,
        latestWithLandmarks.containerDimensions || {},
      );
      aggregatedLandmarks.push(...normalizedLandmarks);
    }

    // ── Finálne containerDimensions — vždy percent, originalWidth = 1920 ────
    const finalContainerDimensions = {
      originalWidth:  1920,
      originalHeight: bestDims?.originalHeight || 2000,
      storageFormat:  'percent',  // po normalizácii sú všetky pozície v percent
    };

    // ── Template URL ─────────────────────────────────────────────────────────
    let componentTemplateUrl = null;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const templatePublicId = `conspiracy-app/component-templates/template_${contentId}`;
      componentTemplateUrl   = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${templatePublicId}.png`;
    } else {
      console.warn('⚠️ CLOUDINARY_CLOUD_NAME not set, no template URL');
    }

    const avgHoverTime = records.length > 0 ? totalHoverTime / records.length : 0;
    const avgTimeSpent = records.length > 0 ? totalTimeSpent / records.length : 0;

    console.log('📊 Aggregated data:', {
      contentId,
      positions:           aggregatedPositions.length,
      users:               users.size,
      landmarks:           aggregatedLandmarks.length,
      containerDimensions: finalContainerDimensions,
    });

    return res.status(200).json({
      success: true,
      data: {
        contentId,
        contentType,
        aggregatedPositions,
        totalPositions:      aggregatedPositions.length,
        usersCount:          users.size,
        recordsCount:        records.length,
        totalHoverTime,
        avgHoverTime,
        avgTimeSpent,
        componentTemplateUrl,
        containerDimensions: finalContainerDimensions,
        landmarks:           aggregatedLandmarks,
      },
    });

  } catch (error) {
    console.error('❌ Get tracking by component error:', error);
    return res.status(500).json({
      success:  false,
      error:    'Internal server error',
      message:  error.message,
    });
  }
}
