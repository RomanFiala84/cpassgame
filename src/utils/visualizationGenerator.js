// src/utils/visualizationGenerator.js
// Generuje len heatmap overlay (bez component screenshotu)

/**
 * Generuje PNG heatmap overlay (bez component pozadia)
 */
export const generateVisualization = async (trackingData, width, height, containerElement) => {
  if (!trackingData.mousePositions || trackingData.mousePositions.length < 5) {
    console.log('⚠️ Insufficient tracking data');
    return null;
  }

  try {
    const fullWidth = containerElement?.scrollWidth || width || 1000;
    const fullHeight = containerElement?.scrollHeight || height || 2000;
    
    console.log('🎨 Creating heatmap overlay:', {
      dimensions: `${fullWidth}x${fullHeight}px`,
      positions: trackingData.mousePositions.length
    });

    // Vytvor transparent canvas
    const canvas = document.createElement('canvas');
    canvas.width = fullWidth;
    canvas.height = fullHeight;
    const ctx = canvas.getContext('2d', { alpha: true });

    // ✅ Transparent pozadie (žiadny screenshot)
    ctx.clearRect(0, 0, fullWidth, fullHeight);

    // Vykresli heatmap overlay
    await drawHeatmapOverlay(ctx, trackingData.mousePositions, fullWidth, fullHeight);

    // Vykresli trajectory
    drawTrajectoryEnhanced(ctx, trackingData.mousePositions);

    // Vykresli markery
    drawMarkers(ctx, trackingData.mousePositions);

    // Konvertuj na Blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });

    if (!blob) {
      throw new Error('Failed to create blob from canvas');
    }

    console.log('✅ Heatmap overlay generated:', {
      size: `${(blob.size / 1024).toFixed(2)}KB`,
      dimensions: `${fullWidth}x${fullHeight}px`
    });

    const objectUrl = URL.createObjectURL(blob);

    return {
      blob,
      objectUrl,
      canvas,
      dimensions: { width: fullWidth, height: fullHeight },
      metadata: {
        contentId: trackingData.contentId,
        contentType: trackingData.contentType,
        userId: trackingData.userId,
        pointsCount: trackingData.mousePositions.length,
        hoverTime: trackingData.totalHoverTime,
        timestamp: Date.now()
      }
    };

  } catch (error) {
    console.error('❌ Error generating visualization:', error);
    return null;
  }
};

/**
 * ✅ NOVÁ FUNKCIA - Vygeneruje referenčný screenshot komponentu
 */
export const generateComponentTemplate = async (containerElement) => {
  if (!containerElement) {
    console.error('❌ No container element provided');
    return null;
  }

  try {
    const html2canvas = (await import('html2canvas')).default;
    
    const screenshot = await html2canvas(containerElement, {
      width: containerElement.scrollWidth,
      height: containerElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 1,
      logging: false,
    });

    // Konvertuj na Blob
    const blob = await new Promise((resolve) => {
      screenshot.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });

    console.log('✅ Component template generated:', {
      width: screenshot.width,
      height: screenshot.height,
      size: `${(blob.size / 1024).toFixed(2)}KB`
    });

    return {
      blob,
      dimensions: {
        width: screenshot.width,
        height: screenshot.height
      }
    };

  } catch (error) {
    console.error('❌ Error generating component template:', error);
    return null;
  }
};

// Pomocné funkcie zostávajú rovnaké...
async function drawHeatmapOverlay(ctx, positions, width, height) {
  const gridSize = 25;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  positions.forEach(pos => {
    const col = Math.floor(pos.x / gridSize);
    const row = Math.floor(pos.y / gridSize);
    
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col]++;
    }
  });
  
  let maxValue = 0;
  grid.forEach(row => {
    row.forEach(val => {
      if (val > maxValue) maxValue = val;
    });
  });

  if (maxValue === 0) return;

  const gradientCanvas = document.createElement('canvas');
  gradientCanvas.width = gridSize * 2;
  gradientCanvas.height = gridSize * 2;
  const gradientCtx = gradientCanvas.getContext('2d');
  
  const centerX = gridSize;
  const centerY = gridSize;
  const gradient = gradientCtx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, gridSize
  );
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
  gradient.addColorStop(0.3, 'rgba(255, 100, 0, 0.5)');
  gradient.addColorStop(0.6, 'rgba(255, 200, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  
  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, gridSize * 2, gridSize * 2);

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const count = grid[r][c];
      if (count > 0) {
        const intensity = count / maxValue;
        const x = c * gridSize;
        const y = r * gridSize;
        
        ctx.globalAlpha = Math.min(0.3 + intensity * 0.7, 1);
        ctx.drawImage(gradientCanvas, x - gridSize / 2, y - gridSize / 2);
      }
    }
  }
  
  ctx.restore();
  console.log(`✅ Heatmap overlay drawn (${rows}x${cols} grid)`);
}

function drawTrajectoryEnhanced(ctx, positions) {
  if (positions.length < 2) return;

  ctx.save();
  
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.8)';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.beginPath();
  ctx.moveTo(positions[0].x, positions[0].y);
  
  const step = Math.max(1, Math.floor(positions.length / 500));
  for (let i = step; i < positions.length; i += step) {
    ctx.lineTo(positions[i].x, positions[i].y);
  }
  
  if (positions.length > 1) {
    ctx.lineTo(positions[positions.length - 1].x, positions[positions.length - 1].y);
  }
  
  ctx.stroke();
  
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = 'rgba(74, 144, 226, 0.9)';
  
  const arrowInterval = Math.max(50, Math.floor(positions.length / 20));
  
  for (let i = arrowInterval; i < positions.length; i += arrowInterval) {
    const p1 = positions[i - 1];
    const p2 = positions[i];
    
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    
    ctx.save();
    ctx.translate(p2.x, p2.y);
    ctx.rotate(angle);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  ctx.restore();
  
  console.log('✅ Enhanced trajectory drawn');
}

function drawMarkers(ctx, positions) {
  if (positions.length === 0) return;

  const first = positions[0];
  const last = positions[positions.length - 1];

  ctx.save();

  // START marker
  ctx.fillStyle = '#00C853';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 6;
  
  ctx.beginPath();
  ctx.arc(first.x, first.y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;
  ctx.fillText('S', first.x, first.y);

  // END marker
  ctx.fillStyle = '#E53935';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 6;
  
  ctx.beginPath();
  ctx.arc(last.x, last.y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  ctx.fillText('E', last.x, last.y);

  ctx.restore();
  
  console.log('✅ Markers drawn');
}
