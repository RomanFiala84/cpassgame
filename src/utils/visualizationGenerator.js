// src/utils/visualizationGenerator.js
// FINÁLNA VERZIA - Individuálna heatmap overlay (1920px template, high-quality)

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

    // ✅ Canvas výška z max Y + buffer
    const maxYPx = Math.max(...convertedPositions.map(p => p.y));
    const actualHeight = Math.min(
      Math.ceil(maxYPx) + 200,
      32767  // ✅ MAX canvas výška v Chrome!
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = actualHeight;
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.clearRect(0, 0, width, actualHeight);

    const gridSize = 10;
    const aggregated = aggregatePositionsToGrid(convertedPositions, gridSize);
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
 * ✅ OPRAVENÁ FUNKCIA - Vykresli heatmap gradient overlay (HIGH QUALITY)
 */
async function drawHeatmapGradientHighQuality(ctx, positions, width, height) {
  if (!positions || positions.length === 0) return;

  // ✅ OPRAVA - Väčší radius pre lepšiu kvalitu
  const radius = 50;
  const gradientCanvas = document.createElement('canvas');
  gradientCanvas.width = radius * 2;
  gradientCanvas.height = radius * 2;
  const gradientCtx = gradientCanvas.getContext('2d');
  
  // ✅ OPRAVA - Radiálny gradient s lepšími farbami
  const gradient = gradientCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');      // Červená (stred) - intenzívnejšia
  gradient.addColorStop(0.25, 'rgba(255, 155, 0, 1)'); // Oranžová
  gradient.addColorStop(0.5, 'rgba(255, 255, 0, 1)');  // Žltá
  gradient.addColorStop(0.75, 'rgba(255, 255, 100, 1)'); // Svetlo žltá
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');      // Transparent (okraj)
  
  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, radius * 2, radius * 2);

  // ✅ OPRAVA - Image smoothing pre lepšiu kvalitu
  gradientCtx.imageSmoothingEnabled = true;
  gradientCtx.imageSmoothingQuality = 'high';

  // Nájdi max count pre intensity scaling
  const maxCount = Math.max(...positions.map(p => p.count || 1));

  // ✅ OPRAVA - Lepšia blending
  ctx.save();
  ctx.globalCompositeOperation = 'lighten';  // ✅ Svetlejšie blending pre lepší efekt

  positions.forEach(pos => {
    const intensity = (pos.count || 1) / maxCount;
    // ✅ OPRAVA - Lepšia alpha kalkulácia
    ctx.globalAlpha = Math.min(0.4 + intensity * 0.6, 0.95);
    ctx.drawImage(gradientCanvas, pos.x - radius, pos.y - radius);
  });

  ctx.restore();
  
  console.log(`✅ High-quality heatmap overlay drawn (${positions.length} aggregated points)`);
}

/**
 * ✅ Vykresli trajectory (cesty myši)
 */
function drawTrajectory(ctx, positions) {
  if (positions.length < 2) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 255, 1)'; // Modrá, semi-transparent
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Znížený sampling (každý 5. bod pre výkon)
  const sampledPositions = positions.filter((_, i) => i % 5 === 0);

  ctx.beginPath();
  ctx.moveTo(sampledPositions[0].x, sampledPositions[0].y);

  for (let i = 1; i < sampledPositions.length; i++) {
    ctx.lineTo(sampledPositions[i].x, sampledPositions[i].y);
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

  // Start marker (zelený)
  const start = positions[0];
  ctx.fillStyle = 'rgba(0, 255, 0, 1)';
  ctx.beginPath();
  ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // End marker (červený)
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
