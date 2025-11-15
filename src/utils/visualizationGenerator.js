// src/utils/visualizationGenerator.js
// FINÁLNA OPRAVA - Zachytí VŠETOK scrollovateľný obsah

import html2canvas from 'html2canvas';

/**
 * Generuje vizualizáciu CELÉHO scrollovateľného obsahu
 * ✅ Funguje aj s grid layoutom a scrollom
 */
export const generateVisualization = async (trackingData, width, height, containerElement) => {
  if (!trackingData.mousePositions || trackingData.mousePositions.length < 5) {
    console.log('Insufficient tracking data for visualization');
    return null;
  }

  try {
    // ✅ Získaj skutočnú výšku celého obsahu
    const fullWidth = containerElement.scrollWidth;
    const fullHeight = containerElement.scrollHeight;
    
    console.log('📸 Creating FULL screenshot:', {
      scrollDimensions: `${fullWidth}x${fullHeight}px`,
      viewportDimensions: `${width}x${height}px`,
    });
    
    // ✅ KĽÚČOVÁ ZMENA - Scroll na začiatok pred screenshotom
    const originalScrollTop = containerElement.scrollTop;
    containerElement.scrollTop = 0;
    
    // ✅ Dočasne odstráň overflow a maxHeight
    const originalStyle = {
      overflow: containerElement.style.overflow,
      maxHeight: containerElement.style.maxHeight,
      height: containerElement.style.height,
    };
    
    containerElement.style.overflow = 'visible';
    containerElement.style.maxHeight = 'none';
    containerElement.style.height = 'auto';
    
    // ✅ Počkaj na rerender
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // ✅ Screenshot CELÉHO obsahu
    const screenshotCanvas = await html2canvas(containerElement, {
      backgroundColor: '#ffffff',
      scale: 1,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
    });
    
    // ✅ Vráť pôvodné štýly
    containerElement.style.overflow = originalStyle.overflow;
    containerElement.style.maxHeight = originalStyle.maxHeight;
    containerElement.style.height = originalStyle.height;
    containerElement.scrollTop = originalScrollTop;

    // ✅ Vytvor finálny canvas
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = fullWidth;
    finalCanvas.height = fullHeight;
    const ctx = finalCanvas.getContext('2d');

    // Nakresli screenshot
    ctx.drawImage(screenshotCanvas, 0, 0, fullWidth, fullHeight);

    // Overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, fullWidth, fullHeight);

    const positions = trackingData.mousePositions;

    // Heatmap
    const heatmapData = generateHeatmapData(positions, fullWidth, fullHeight);
    drawHeatmap(ctx, heatmapData);

    // Trajectory
    drawTrajectory(ctx, positions);

    // Markers
    drawMarkers(ctx, positions);

    // Info panel
    drawInfoPanel(ctx, trackingData, fullWidth, fullHeight);

    console.log('✅ Full screenshot created:', {
      finalSize: `${fullWidth}x${fullHeight}px`,
      positions: positions.length
    });
    
    return finalCanvas.toDataURL('image/jpeg', 0.85);

  } catch (error) {
    console.error('❌ Error generating visualization:', error);
    return null;
  }
};

function drawTrajectory(ctx, positions) {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;

  ctx.moveTo(positions[0].x, positions[0].y);
  positions.forEach((pos, idx) => {
    if (idx === 0) return;
    ctx.lineTo(pos.x, pos.y);
  });

  ctx.stroke();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

function drawMarkers(ctx, positions) {
  const first = positions[0];
  const last = positions[positions.length - 1];
  
  // START
  ctx.beginPath();
  ctx.arc(first.x, first.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#00C853';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START', first.x, first.y);

  // END
  ctx.beginPath();
  ctx.arc(last.x, last.y, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#E53935';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.fillText('END', last.x, last.y);
}

function drawInfoPanel(ctx, trackingData, width, height) {
  const padding = 20;
  const panelWidth = 300;
  const panelHeight = 130;
  const panelX = width - panelWidth - padding;
  const panelY = height - panelHeight - padding;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 12);
  ctx.fill();

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
  
  return { heatmap, gridSize, cols, rows };
}

function drawHeatmap(ctx, heatmapData) {
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

function getHeatmapColor(intensity) {
  if (intensity < 0.25) {
    return `rgba(0, 120, 255, ${0.3 + intensity * 0.8})`;
  } else if (intensity < 0.5) {
    return `rgba(0, 200, 150, ${0.4 + intensity * 0.9})`;
  } else if (intensity < 0.75) {
    return `rgba(255, 200, 0, ${0.5 + intensity * 0.9})`;
  } else {
    return `rgba(255, 50, 0, ${0.6 + intensity * 0.9})`;
  }
}

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
