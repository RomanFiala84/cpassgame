// src/utils/visualizationGenerator.js

/**
 * ✅ Vygeneruje individuálnu heatmap overlay (transparent pozadie)
 */
export const generateVisualization = async (trackingData, width, height, containerElement) => {
  try {
    if (!trackingData.mousePositions || trackingData.mousePositions.length === 0) {
      console.warn('⚠️ No mouse positions to visualize');
      return null;
    }

    // ✅ Pozície sú už v px (konvertované v trackingHelpers)
    const convertedPositions = trackingData.mousePositions;

    // ✅ Canvas výška z max Y + buffer, max 32767px (Chrome limit)
    const maxYPx = Math.max(...convertedPositions.map(p => p.y));
    const actualHeight = Math.min(Math.ceil(maxYPx) + 200, 32767);

    console.log('🎨 Creating heatmap:', {
      positions: convertedPositions.length,
      canvasSize: `${width}×${actualHeight}`,
      maxY: maxYPx
    });

    // ✅ Yield pred ťažkou canvas operáciou — nezamrzne UI
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = actualHeight;
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.clearRect(0, 0, width, actualHeight);

    const gridSize = 10;
    const aggregated = aggregatePositionsToGrid(convertedPositions, gridSize);

    console.log(`📊 Aggregated ${convertedPositions.length} → ${aggregated.length} grid points`);

    await drawHeatmapGradientHighQuality(ctx, aggregated, width, actualHeight);

    if (convertedPositions.length > 1) {
      drawTrajectory(ctx, convertedPositions);
    }
    drawMarkers(ctx, convertedPositions);

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 1);
    });

    if (!blob || blob.size === 0) {
      console.error('❌ Generated blob is empty!');
      return null;
    }

    console.log('✅ Heatmap generated:', {
      size: `${(blob.size / 1024).toFixed(2)}KB`,
      dimensions: `${width}×${actualHeight}`
    });

    const objectUrl = URL.createObjectURL(blob);
    return { blob, objectUrl, width, height: actualHeight };

  } catch (error) {
    console.error('❌ Heatmap generation error:', error);
    return null;
  }
};

/**
 * ✅ Agreguj pozície do gridu (zníženie počtu bodov)
 */
function aggregatePositionsToGrid(positions, gridSize = 10) {
  const grid = new Map();

  positions.forEach(pos => {
    const gridX = Math.floor(pos.x / gridSize) * gridSize;
    const gridY = Math.floor(pos.y / gridSize) * gridSize;
    const key = `${gridX},${gridY}`;

    if (!grid.has(key)) {
      grid.set(key, {
        x: gridX + gridSize / 2,
        y: gridY + gridSize / 2,
        count: 0
      });
    }
    grid.get(key).count++;
  });

  return Array.from(grid.values());
}

/**
 * ✅ Vykresli heatmap gradient overlay (BATCH — nezamrzne UI)
 */
async function drawHeatmapGradientHighQuality(ctx, positions, width, height) {
  if (!positions || positions.length === 0) return;

  const radius = 50;
  const gradientCanvas = document.createElement('canvas');
  gradientCanvas.width = radius * 2;
  gradientCanvas.height = radius * 2;
  const gradientCtx = gradientCanvas.getContext('2d');

  const gradient = gradientCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
  gradient.addColorStop(0.25, 'rgba(255, 155, 0, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 0, 1)');
  gradient.addColorStop(0.75, 'rgba(255, 255, 100, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, radius * 2, radius * 2);
  gradientCtx.imageSmoothingEnabled = true;
  gradientCtx.imageSmoothingQuality = 'high';

  const maxCount = Math.max(...positions.map(p => p.count || 1));

  ctx.save();
  ctx.globalCompositeOperation = 'lighten';

  // ✅ Batch processing — každých 100 bodov uvoľni UI thread
  const BATCH_SIZE = 100;
  for (let i = 0; i < positions.length; i += BATCH_SIZE) {
    const batch = positions.slice(i, i + BATCH_SIZE);

    batch.forEach(pos => {
      const intensity = (pos.count || 1) / maxCount;
      ctx.globalAlpha = Math.min(0.4 + intensity * 0.6, 0.95);
      ctx.drawImage(gradientCanvas, pos.x - radius, pos.y - radius);
    });

    // ✅ Yield UI thread medzi dávkami
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  ctx.restore();
  console.log(`✅ Heatmap drawn (${positions.length} aggregated points)`);
}

/**
 * ✅ Vykresli trajectory (cesty myši)
 */
function drawTrajectory(ctx, positions) {
  if (positions.length < 2) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 255, 1)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Každý 5. bod pre výkon
  const sampled = positions.filter((_, i) => i % 5 === 0);

  ctx.beginPath();
  ctx.moveTo(sampled[0].x, sampled[0].y);
  for (let i = 1; i < sampled.length; i++) {
    ctx.lineTo(sampled[i].x, sampled[i].y);
  }
  ctx.stroke();
  ctx.restore();

  console.log('✅ Trajectory drawn');
}

/**
 * ✅ Vykresli start/end markery
 */
function drawMarkers(ctx, positions) {
  if (positions.length === 0) return;

  ctx.save();

  // Start — zelený
  const start = positions[0];
  ctx.fillStyle = 'rgba(0, 255, 0, 1)';
  ctx.beginPath();
  ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // End — červený
  const end = positions[positions.length - 1];
  ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  ctx.beginPath();
  ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
  console.log('✅ Markers drawn');
}
