/**
 * Generuje canvas vizualizáciu pohybu myši
 * @param {object} trackingData - Tracking dáta s mousePositions
 * @param {number} width - Šírka canvas
 * @param {number} height - Výška canvas
 * @returns {string|null} - Base64 data URL alebo null
 */
export const generateVisualization = (trackingData, width, height) => {
  // Minimálne 5 bodov pre zmysluplnú vizualizáciu
  if (!trackingData.mousePositions || trackingData.mousePositions.length < 5) {
    console.log('Insufficient tracking data for visualization');
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Pozadie
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const positions = trackingData.mousePositions;

  // Nakresliť trajektóriu
  ctx.beginPath();
  ctx.strokeStyle = '#4A90E2';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const firstPos = positions[0];
  ctx.moveTo(firstPos.x, firstPos.y);

  // Nakresliť cestu
  positions.forEach((pos, index) => {
    if (index === 0) return;
    ctx.lineTo(pos.x, pos.y);
  });

  ctx.stroke();

  // Nakresliť body každých 1 sekundu (každých 5 bodov pri 200ms intervale)
  positions.forEach((pos, index) => {
    if (index % 5 === 0) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(74, 144, 226, 0.6)';
      ctx.fill();
    }
  });

  // Označiť začiatok (zelený)
  ctx.beginPath();
  ctx.arc(firstPos.x, firstPos.y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#00C853';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Označiť koniec (červený)
  const lastPos = positions[positions.length - 1];
  ctx.beginPath();
  ctx.arc(lastPos.x, lastPos.y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#E53935';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pridať info text
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.fillText(
    `Hover time: ${(trackingData.totalHoverTime / 1000).toFixed(1)}s`,
    10,
    height - 10
  );
  ctx.fillText(
    `Points: ${positions.length}`,
    10,
    height - 25
  );

  // Vrátiť ako WebP base64
  return canvas.toDataURL('image/webp', 0.8);
};
