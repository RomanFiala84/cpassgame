// src/utils/visualizationGenerator.js
// CANVAS-BASED VISUALIZATION - Pre Cloudinary upload
// Generuje PNG obrázok s heatmap overlay

/**
 * Generuje PNG vizualizáciu s heatmap overlay
 * ✅ Canvas rendering - rýchly a efektívny
 * ✅ Kompatibilný s Cloudinary
 * ✅ Presné pozície s agregáciou
 */
export const generateVisualization = async (trackingData, width, height, containerElement) => {
  if (!trackingData.mousePositions || trackingData.mousePositions.length < 5) {
    console.log('⚠️ Insufficient tracking data for visualization');
    return null;
  }

  try {
    const fullWidth = containerElement?.scrollWidth || width;
    const fullHeight = containerElement?.scrollHeight || height;
    
    console.log('🎨 Creating Canvas visualization:', {
      dimensions: `${fullWidth}x${fullHeight}px`,
      positions: trackingData.mousePositions.length
    });

    // Vytvor canvas
    const canvas = document.createElement('canvas');
    canvas.width = fullWidth;
    canvas.height = fullHeight;
    const ctx = canvas.getContext('2d', { alpha: true });

    // 1. Zachyť screenshot obsahy (ak je možné)
    if (containerElement) {
      await captureContainerToCanvas(containerElement, canvas, ctx);
    } else {
      // Biely background ak nemáme element
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, fullWidth, fullHeight);
    }

    // 2. Vykresli heatmap overlay
    await drawHeatmapOverlay(ctx, trackingData.mousePositions, fullWidth, fullHeight);

    // 3. Vykresli trajectory a markery
    drawTrajectory(ctx, trackingData.mousePositions);
    drawMarkers(ctx, trackingData.mousePositions);

    // 4. Vykresli info panel
    drawInfoPanel(ctx, trackingData, fullWidth, fullHeight);

    // 5. Konvertuj canvas na Blob pre upload
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
    });

    if (!blob) {
      throw new Error('Failed to create blob from canvas');
    }

    console.log('✅ Canvas visualization generated:', {
      size: `${(blob.size / 1024).toFixed(2)}KB`,
      dimensions: `${fullWidth}x${fullHeight}px`
    });

    // Vytvor Object URL pre preview (dočasný)
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
 * Zachytí obsah containeru na canvas pomocou html2canvas
 */
async function captureContainerToCanvas(containerElement, canvas, ctx) {
  try {
    // Ak máte html2canvas nainštalovaný (už je vo vašom package.json)
    const html2canvas = (await import('html2canvas')).default;
    
    const screenshot = await html2canvas(containerElement, {
      width: canvas.width,
      height: canvas.height,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 1,
      logging: false
    });

    // Prekopíruj screenshot na náš canvas
    ctx.drawImage(screenshot, 0, 0);
    console.log('✅ Container content captured');
    
  } catch (error) {
    console.warn('⚠️ Failed to capture container, using white background:', error);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Vykresli optimalizovaný heatmap overlay
 * ✅ Grid-based agregácia
 * ✅ Radial gradients
 */
async function drawHeatmapOverlay(ctx, positions, width, height) {
  const gridSize = 25;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  // Vytvor grid pre agregáciu
  const grid = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  // Agreguj pozície do gridu
  positions.forEach(pos => {
    const col = Math.floor(pos.x / gridSize);
    const row = Math.floor(pos.y / gridSize);
    
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col]++;
    }
  });
  
  // Nájdi maximum pre normalizáciu
  let maxValue = 0;
  grid.forEach(row => {
    row.forEach(val => {
      if (val > maxValue) maxValue = val;
    });
  });

  if (maxValue === 0) return;

  // Vytvor offscreen canvas pre gradient template
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

  // Vykresli grid bunky s gradientmi
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  
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

/**
 * Vykresli trajectory line
 */
function drawTrajectory(ctx, positions) {
  if (positions.length < 2) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;
  
  ctx.beginPath();
  ctx.moveTo(positions[0].x, positions[0].y);
  
  // Simplified line pre performance
  const step = Math.max(1, Math.floor(positions.length / 500));
  for (let i = step; i < positions.length; i += step) {
    ctx.lineTo(positions[i].x, positions[i].y);
  }
  
  // Vždy zahrň posledný bod
  if (positions.length > 1) {
    ctx.lineTo(positions[positions.length - 1].x, positions[positions.length - 1].y);
  }
  
  ctx.stroke();
  ctx.restore();
  
  console.log('✅ Trajectory drawn');
}

/**
 * Vykresli START a END markery
 */
function drawMarkers(ctx, positions) {
  if (positions.length === 0) return;

  const first = positions[0];
  const last = positions[positions.length - 1];

  ctx.save();

  // START marker (zelený)
  ctx.fillStyle = '#00C853';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 6;
  
  ctx.beginPath();
  ctx.arc(first.x, first.y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;
  ctx.fillText('S', first.x, first.y);

  // END marker (červený)
  ctx.fillStyle = '#E53935';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 6;
  
  ctx.beginPath();
  ctx.arc(last.x, last.y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  ctx.fillText('E', last.x, last.y);

  ctx.restore();
  
  console.log('✅ Markers drawn');
}

/**
 * Vykresli info panel v pravom dolnom rohu
 */
function drawInfoPanel(ctx, trackingData, width, height) {
  const padding = 20;
  const panelWidth = 250;
  const panelHeight = 160;
  const x = width - panelWidth - padding;
  const y = height - panelHeight - padding;

  ctx.save();

  // Panel background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  
  // Rounded rectangle
  const radius = 12;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + panelWidth - radius, y);
  ctx.quadraticCurveTo(x + panelWidth, y, x + panelWidth, y + radius);
  ctx.lineTo(x + panelWidth, y + panelHeight - radius);
  ctx.quadraticCurveTo(x + panelWidth, y + panelHeight, x + panelWidth - radius, y + panelHeight);
  ctx.lineTo(x + radius, y + panelHeight);
  ctx.quadraticCurveTo(x, y + panelHeight, x, y + panelHeight - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🔥 Heatmap Info', x + 16, y + 28);

  // Stats
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const lineHeight = 24;
  let currentY = y + 58;

  const stats = [
    `⏱️ Hover time: ${(trackingData.totalHoverTime / 1000).toFixed(1)}s`,
    `📍 Points: ${trackingData.mousePositions.length.toLocaleString()}`,
    `📐 Size: ${width}×${height}px`,
    `👤 User: ${trackingData.userId || 'N/A'}`,
    `📝 Content: ${trackingData.contentId || 'N/A'}`
  ];

  stats.forEach(stat => {
    ctx.fillText(stat, x + 16, currentY);
    currentY += lineHeight;
  });

  ctx.restore();
  
  console.log('✅ Info panel drawn');
}

/**
 * Export pre samostatné HTML (bonusová funkcia - nie pre Cloudinary)
 */
export const exportAsInteractiveHTML = async (trackingData, containerElement) => {
  const canvas = document.createElement('canvas');
  const fullWidth = containerElement.scrollWidth;
  const fullHeight = containerElement.scrollHeight;
  
  canvas.width = fullWidth;
  canvas.height = fullHeight;
  const ctx = canvas.getContext('2d');

  // Vytvor vizualizáciu
  await captureContainerToCanvas(containerElement, canvas, ctx);
  await drawHeatmapOverlay(ctx, trackingData.mousePositions, fullWidth, fullHeight);
  drawTrajectory(ctx, trackingData.mousePositions);
  drawMarkers(ctx, trackingData.mousePositions);
  drawInfoPanel(ctx, trackingData, fullWidth, fullHeight);

  // Konvertuj na data URL
  const imageDataUrl = canvas.toDataURL('image/png', 0.95);

  // Vytvor HTML wrapper
  const html = `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Heatmap - ${trackingData.contentId}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }
    .download-btn {
      margin-top: 20px;
      padding: 12px 24px;
      background: #9d4edd;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .download-btn:hover {
      background: #7b2cbf;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${imageDataUrl}" alt="Heatmap Visualization">
    <button class="download-btn" onclick="downloadImage()">💾 Download PNG</button>
  </div>
  <script>
    function downloadImage() {
      const link = document.createElement('a');
      link.download = 'heatmap_${trackingData.contentId}_${Date.now()}.png';
      link.href = '${imageDataUrl}';
      link.click();
    }
  </script>
</body>
</html>`;

  // Vytvor blob a download link
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  return {
    html,
    url,
    blob
  };
};
