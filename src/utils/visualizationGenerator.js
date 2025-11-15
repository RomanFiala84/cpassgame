// src/utils/visualizationGenerator.js
// FINÁLNA VERZIA - Ukladá v ORIGINÁLNOM rozlíšení (bez scalingu)

import html2canvas from 'html2canvas';

/**
 * Generuje vizualizáciu v ORIGINÁLNOM rozlíšení
 * ✅ Žiadny scaling - tracking pozície presne sedia
 */
export const generateVisualization = async (trackingData, width, height, containerElement) => {
  if (!trackingData.mousePositions || trackingData.mousePositions.length < 5) {
    console.log('Insufficient tracking data for visualization');
    return null;
  }

  try {
    // ✅ Použiť ORIGINÁLNE rozmery (bez downscalingu)
    const fullWidth = containerElement.scrollWidth;
    const fullHeight = containerElement.scrollHeight;
    
    console.log('📸 Creating screenshot in ORIGINAL resolution:', {
      original: `${fullWidth}x${fullHeight}px`,
    });
    
    // ✅ Temporarily expand container
    const originalHeight = containerElement.style.height;
    const originalOverflow = containerElement.style.overflow;
    const originalMaxHeight = containerElement.style.maxHeight;
    
    containerElement.style.height = 'auto';
    containerElement.style.maxHeight = 'none';
    containerElement.style.overflow = 'visible';
    
    // ✅ FULL CONTENT SCREENSHOT v originálnom rozlíšení
    console.log('📸 Capturing FULL content...');
    
    const screenshotCanvas = await html2canvas(containerElement, {
      backgroundColor: '#ffffff',
      scale: 1, // ✅ Bez upscalingu
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: fullWidth,
      height: fullHeight,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });
    
    // ✅ Restore original styles
    containerElement.style.height = originalHeight;
    containerElement.style.overflow = originalOverflow;
    containerElement.style.maxHeight = originalMaxHeight;

    // ✅ Použiť ORIGINÁLNE rozmery (bez scalingu)
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = fullWidth;
    finalCanvas.height = fullHeight;
    const ctx = finalCanvas.getContext('2d');

    // ✅ Nakresli screenshot (1:1, bez scalingu)
    ctx.drawImage(screenshotCanvas, 0, 0, fullWidth, fullHeight);

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    const positions = trackingData.mousePositions;

    // HEATMAP
    console.log('🔥 Generating heatmap...');
    const heatmapData = generateHeatmapData(positions, fullWidth, fullHeight);
    drawHeatmap(ctx, heatmapData, fullWidth, fullHeight);

    // Trajektória
    drawTrajectory(ctx, positions, fullWidth, fullHeight);

    // Markers
    drawMarkers(ctx, positions, fullWidth, fullHeight);

    // Info panel
    drawInfoPanel(ctx, trackingData, fullWidth, fullHeight);

    console.log('✅ Screenshot + heatmap generated in ORIGINAL resolution');
    return finalCanvas.toDataURL('image/jpeg', 0.85);

  } catch (error) {
    console.error('❌ Error generating visualization:', error);
    return null;
  }
};

/**
 * Trajektória - ✅ Bez scalingu (1:1)
 */
function drawTrajectory(ctx, positions, width, height) {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;

  const firstPos = positions[0];
  ctx.moveTo(firstPos.x, firstPos.y);

  positions.forEach((pos, index) => {
    if (index === 0) return;
    ctx.lineTo(pos.x, pos.y);
  });

  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

/**
 * Markers - ✅ Bez scalingu (1:1)
 */
function drawMarkers(ctx, positions, width, height) {
  const firstPos = positions[0];
  
  ctx.beginPath();
  ctx.arc(firstPos.x, firstPos.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#00C853';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', firstPos.x, firstPos.y);

  const lastPos = positions[positions.length - 1];
  
  ctx.beginPath();
  ctx.arc(lastPos.x, lastPos.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#E53935';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('END', lastPos.x, lastPos.y);
}

/**
 * Info panel
 */
function drawInfoPanel(ctx, trackingData, width, height) {
  const padding = 20;
  const panelWidth = 300;
  const panelHeight = 130;
  const panelX = width - panelWidth - padding;
  const panelY = height - panelHeight - padding;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 12);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const hoverTime = (trackingData.totalHoverTime / 1000).toFixed(1);
  const pointsCount = trackingData.mousePositions.length;

  ctx.fillText(`⏱️ Hover time: ${hoverTime}s`, panelX + 15, panelY + 15);
  ctx.fillText(`📍 Points: ${pointsCount}`, panelX + 15, panelY + 45);
  ctx.fillText(`🔥 Heatmap enabled`, panelX + 15, panelY + 75);
  
  ctx.font = '13px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(`📐 ${width}×${height}px`, panelX + 15, panelY + 105);
}

/**
 * Heatmap generation - ✅ Bez scalingu
 */
function generateHeatmapData(positions, width, height) {
  const gridSize = 25;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  const heatmap = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  positions.forEach(pos => {
    const col = Math.floor(pos.x / gridSize);
    const row = Math.floor(pos.y / gridSize);
    
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      heatmap[row][col]++;
    }
  });
  
  let maxValue = 0;
  heatmap.forEach(row => {
    row.forEach(val => {
      if (val > maxValue) maxValue = val;
    });
  });
  
  if (maxValue > 0) {
    heatmap.forEach((row, r) => {
      row.forEach((val, c) => {
        heatmap[r][c] = val / maxValue;
      });
    });
  }
  
  return { heatmap, gridSize, cols, rows, maxValue };
}

/**
 * Draw heatmap
 */
function drawHeatmap(ctx, heatmapData, width, height) {
  const { heatmap, gridSize } = heatmapData;
  
  heatmap.forEach((row, r) => {
    row.forEach((intensity, c) => {
      if (intensity > 0.05) {
        const x = c * gridSize;
        const y = r * gridSize;
        
        const color = getHeatmapColor(intensity);
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, gridSize, gridSize);
      }
    });
  });
}

/**
 * Heatmap color
 */
function getHeatmapColor(intensity) {
  if (intensity < 0.25) {
    const alpha = 0.3 + (intensity * 0.8);
    return `rgba(0, 120, 255, ${alpha})`;
  } else if (intensity < 0.5) {
    const alpha = 0.4 + (intensity * 0.9);
    return `rgba(0, 200, 150, ${alpha})`;
  } else if (intensity < 0.75) {
    const alpha = 0.5 + (intensity * 0.9);
    return `rgba(255, 200, 0, ${alpha})`;
  } else {
    const alpha = 0.6 + (intensity * 0.9);
    return `rgba(255, 50, 0, ${alpha})`;
  }
}

// Helper
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
  return this;
};
