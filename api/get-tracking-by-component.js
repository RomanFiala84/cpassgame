// api/get-tracking-by-component.js
// OPTIMALIZOVANÁ VERZIA s agregáciou na DB level

import { connectToDatabase, ensureIndexes } from './utils/dbConnect';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { contentId, contentType, includePositions = 'true' } = req.query;

    // Validácia
    if (!contentId || !contentType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: contentId and contentType'
      });
    }

    const { db } = await connectToDatabase();
    await ensureIndexes(db);

    const includePos = includePositions === 'true';

    // ✅ OPTIMALIZÁCIA - Použiť agregáciu namiesto client-side processing
    const aggregationPipeline = [
      {
        $match: {
          contentId: contentId,
          contentType: contentType
        }
      },
      {
        $sort: { timestamp: -1 }
      }
    ];

    // Ak nepotrebujeme pozície, skipni ich
    if (!includePos) {
      aggregationPipeline.push({
        $project: {
          mousePositions: 0 // Exclude positions
        }
      });
    }

    const records = await db.collection('hover_tracking')
      .aggregate(aggregationPipeline)
      .toArray();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No tracking data found for this component'
      });
    }

    // ✅ OPTIMALIZÁCIA - Agreguj na databáze, nie v JS
    let aggregatedPositions = [];
    let totalHoverTime = 0;
    const uniqueUsers = new Set();

    if (includePos) {
      // Použiť streaming pre veľké datasety
      const maxPositions = 50000; // Limit pre performance
      let positionCount = 0;

      for (const record of records) {
        uniqueUsers.add(record.userId);
        
        if (record.mousePositions && Array.isArray(record.mousePositions)) {
          // ✅ OPTIMALIZÁCIA - Sample positions ak ich je príliš veľa
          const positions = record.mousePositions;
          
          if (positionCount + positions.length > maxPositions) {
            // Sample aby sme neprekročili limit
            const remaining = maxPositions - positionCount;
            const step = Math.ceil(positions.length / remaining);
            const sampled = positions.filter((_, idx) => idx % step === 0);
            aggregatedPositions.push(...sampled.slice(0, remaining));
            positionCount = maxPositions;
            break;
          } else {
            aggregatedPositions.push(...positions);
            positionCount += positions.length;
          }
        }
        
        if (record.hoverMetrics?.totalHoverTime) {
          totalHoverTime += record.hoverMetrics.totalHoverTime;
        }
      }

      console.log(`📊 Aggregated ${positionCount} positions from ${records.length} records`);
    } else {
      // Len spočítaj bez načítania pozícií
      records.forEach(record => {
        uniqueUsers.add(record.userId);
        if (record.hoverMetrics?.totalHoverTime) {
          totalHoverTime += record.hoverMetrics.totalHoverTime;
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        contentId,
        contentType,
        usersCount: uniqueUsers.size,
        recordsCount: records.length,
        totalPositions: aggregatedPositions.length,
        totalHoverTime,
        avgHoverTime: uniqueUsers.size > 0 ? Math.round(totalHoverTime / uniqueUsers.size) : 0,
        aggregatedPositions: includePos ? aggregatedPositions : undefined,
        individualRecords: records.map(r => ({
          ...r,
          mousePositions: includePos ? undefined : r.mousePositions // Strip positions z response
        })),
        containerDimensions: records[0]?.containerDimensions || null,
        _meta: {
          positionsIncluded: includePos,
          samplingApplied: aggregatedPositions.length >= 50000
        }
      }
    });

  } catch (error) {
    console.error('❌ Get tracking by component error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
