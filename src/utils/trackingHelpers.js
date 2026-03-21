// src/utils/trackingHelpers.js

import { generateVisualization } from './visualizationGenerator';

const STANDARD_WIDTH = 1920;
const MAX_HEIGHT     = 10000;
const MIN_HEIGHT     = 600;

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror   = reject;
    reader.readAsDataURL(blob);
  });
}

export function calculateProportionalHeight(originalWidth, originalHeight, targetWidth) {
  const scale        = targetWidth / originalWidth;
  const targetHeight = Math.round(originalHeight * scale);
  return Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, targetHeight));
}

async function resizeImageToStandardHighQuality(blob, targetWidth = STANDARD_WIDTH) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const targetHeight = calculateProportionalHeight(img.width, img.height, targetWidth);
      const canvas       = document.createElement('canvas');
      canvas.width       = targetWidth;
      canvas.height      = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle            = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((resizedBlob) => {
        URL.revokeObjectURL(url);
        resolve({ blob: resizedBlob, width: targetWidth, height: targetHeight });
      }, 'image/png', 1);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

function normalizeTrackingPositionsAsPercent(positions, originalWidth, originalHeight) {
  if (!positions || positions.length === 0) return [];
  return positions.map(pos => {
    const normalized = {
      x:         Number(((pos.x / originalWidth)  * 100).toFixed(4)),
      y:         Number(((pos.y / originalHeight) * 100).toFixed(4)),
      timestamp: pos.timestamp,
    };
    if (pos.nearestLandmark) {
      normalized.nearestLandmark = {
        id:   pos.nearestLandmark.id,
        type: pos.nearestLandmark.type,
        offsetX: Number(((pos.nearestLandmark.offsetX / originalWidth)  * 100).toFixed(4)),
        offsetY: Number(((pos.nearestLandmark.offsetY / originalHeight) * 100).toFixed(4)),
        landmarkPosition: {
          top:    Number(((pos.nearestLandmark.landmarkPosition.top    / originalHeight) * 100).toFixed(4)),
          left:   Number(((pos.nearestLandmark.landmarkPosition.left   / originalWidth)  * 100).toFixed(4)),
          width:  Number(((pos.nearestLandmark.landmarkPosition.width  / originalWidth)  * 100).toFixed(4)),
          height: Number(((pos.nearestLandmark.landmarkPosition.height / originalHeight) * 100).toFixed(4)),
        },
      };
    }
    return normalized;
  });
}

function normalizeLandmarksAsPercent(landmarks, originalWidth, originalHeight) {
  if (!landmarks || landmarks.length === 0) return [];
  return landmarks.map(landmark => ({
    id:   landmark.id,
    type: landmark.type,
    position: {
      top:    Number(((landmark.position.top    / originalHeight) * 100).toFixed(4)),
      left:   Number(((landmark.position.left   / originalWidth)  * 100).toFixed(4)),
      width:  Number(((landmark.position.width  / originalWidth)  * 100).toFixed(4)),
      height: Number(((landmark.position.height / originalHeight) * 100).toFixed(4)),
    },
  }));
}

export function convertPercentToPixels(positions, templateWidth, templateHeight) {
  if (!positions || positions.length === 0) return [];
  return positions.map(pos => {
    const pixel = {
      x:         Math.round((pos.x / 100) * templateWidth),
      y:         Math.round((pos.y / 100) * templateHeight),
      timestamp: pos.timestamp,
    };
    if (pos.nearestLandmark) {
      pixel.nearestLandmark = {
        id:   pos.nearestLandmark.id,
        type: pos.nearestLandmark.type,
        offsetX: Math.round((pos.nearestLandmark.offsetX / 100) * templateWidth),
        offsetY: Math.round((pos.nearestLandmark.offsetY / 100) * templateHeight),
        landmarkPosition: {
          top:    Math.round((pos.nearestLandmark.landmarkPosition.top    / 100) * templateHeight),
          left:   Math.round((pos.nearestLandmark.landmarkPosition.left   / 100) * templateWidth),
          width:  Math.round((pos.nearestLandmark.landmarkPosition.width  / 100) * templateWidth),
          height: Math.round((pos.nearestLandmark.landmarkPosition.height / 100) * templateHeight),
        },
      };
    }
    return pixel;
  });
}

export function convertLandmarksPercentToPixels(landmarks, templateWidth, templateHeight) {
  if (!landmarks || landmarks.length === 0) return [];
  return landmarks.map(landmark => ({
    id:   landmark.id,
    type: landmark.type,
    position: {
      top:    Math.round((landmark.position.top    / 100) * templateHeight),
      left:   Math.round((landmark.position.left   / 100) * templateWidth),
      width:  Math.round((landmark.position.width  / 100) * templateWidth),
      height: Math.round((landmark.position.height / 100) * templateHeight),
    },
  }));
}

// =====================================================
// ✅ NOVÁ FUNKCIA — len uloženie dát, bez canvas/heatmap
// =====================================================
export const saveTrackingOnly = async (trackingData) => {
  try {
    console.log('💾 Saving tracking data (no heatmap)...');

    const originalWidth     = trackingData.containerDimensions?.originalWidth  || STANDARD_WIDTH; // ✅ opravený kľúč
    const originalHeight    = trackingData.containerDimensions?.originalHeight || MIN_HEIGHT;      // ✅ opravený kľúč
    const alreadyNormalized = trackingData.containerDimensions?.storageFormat === 'percent';       // ✅ preskočiť double-normalizáciu

    const normalizedPositions = alreadyNormalized
      ? trackingData.mousePositions
      : normalizeTrackingPositionsAsPercent(trackingData.mousePositions, originalWidth, originalHeight);

    const normalizedLandmarks = alreadyNormalized
      ? (trackingData.landmarks || [])
      : normalizeLandmarksAsPercent(trackingData.landmarks || [], originalWidth, originalHeight);

    const response = await fetch('/api/save-tracking', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...trackingData,
        mousePositions: normalizedPositions,
        landmarks:      normalizedLandmarks,
        containerDimensions: {
          originalWidth,
          originalHeight,
          storageFormat: 'percent',
        },
      }),
    });

    if (!response.ok) throw new Error(`Failed to save tracking: ${response.status}`);

    const result = await response.json();
    console.log('✅ Tracking data saved:', result);
    return { success: true, tracking: result };

  } catch (error) {
    console.error('❌ Failed to save tracking:', error);
    throw error;
  }
};

// =====================================================
// ✅ ON-DEMAND FUNKCIA — generuje + uploaduje heatmap
// =====================================================
export const generateAndUploadHeatmap = async (trackingRecord) => {
  try {
    console.log('🎨 Generating heatmap on-demand for:', trackingRecord._id);

    const { originalWidth, originalHeight } = trackingRecord.containerDimensions;
    const targetWidth  = STANDARD_WIDTH;
    const targetHeight = calculateProportionalHeight(originalWidth, originalHeight, targetWidth);

    const pixelPositions = convertPercentToPixels(
      trackingRecord.mousePositions, targetWidth, targetHeight
    );
    const pixelLandmarks = convertLandmarksPercentToPixels(
      trackingRecord.landmarks || [], targetWidth, targetHeight
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    const visualization = await generateVisualization(
      { mousePositions: pixelPositions, landmarks: pixelLandmarks },
      targetWidth,
      targetHeight
    );

    if (!visualization || !visualization.blob) {
      throw new Error('Visualization generation failed');
    }

    console.log('✅ Heatmap generated:', `${(visualization.blob.size / 1024).toFixed(2)}KB`);

    const base64Image = await blobToBase64(visualization.blob);

    const cloudinaryResponse = await fetch('/api/upload-heatmap', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64:  base64Image,
        contentId:    trackingRecord.contentId,
        contentType:  trackingRecord.contentType,
        userId:       trackingRecord.userId,
        trackingId:   trackingRecord._id,
      }),
    });

    if (!cloudinaryResponse.ok) throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status}`);

    const cloudinaryResult = await cloudinaryResponse.json();
    console.log('✅ Heatmap uploaded:', cloudinaryResult.data?.url);

    await fetch('/api/update-tracking-cloudinary', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingId:    trackingRecord._id,
        cloudinaryData: cloudinaryResult.data,
      }),
    });

    URL.revokeObjectURL(visualization.objectUrl);

    return cloudinaryResult.data?.url;

  } catch (error) {
    console.error('❌ Heatmap generation failed:', error);
    throw error;
  }
};

// =====================================================
// ✅ DEPRECATED — presmeruje na saveTrackingOnly
// =====================================================
export const saveTrackingWithVisualization = async (trackingData, containerElement) => {
  console.warn('⚠️ saveTrackingWithVisualization je deprecated — používaj saveTrackingOnly');
  return await saveTrackingOnly(trackingData);
};

// =====================================================
// ✅ generateAndUploadComponentTemplate
// =====================================================
export const generateAndUploadComponentTemplate = async (containerElement, contentId, contentType) => {
  if (!containerElement) { console.warn('⚠️ No container element'); return null; }
  let styleSheet = null;
  try {
    const html2canvas   = (await import('html2canvas')).default;
    const ownerDocument = containerElement.ownerDocument;

    // ✅ FIX 1: Scroll na vrch pred meraním — inak scrollHeight môže byť orezaný
    window.scrollTo(0, 0);
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));

    // ✅ FIX 2: Inject CSS — animácie + fix čísel v ol pre html2canvas
    styleSheet = document.createElement('style');
    styleSheet.textContent = `
      * { animation: none !important; transition: none !important; }

      ol {
        list-style: none !important;
        counter-reset: list-counter !important;
        padding-left: 20px !important;
      }
      ol > li {
        counter-increment: list-counter !important;
        position: relative !important;
        padding-left: 24px !important;
      }
      ol > li::before {
        content: counter(list-counter) "." !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        font-size: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        font-weight: inherit !important;
      }
      ol ol {
        counter-reset: alpha-counter !important;
      }
      ol ol > li {
        counter-increment: alpha-counter !important;
      }
      ol ol > li::before {
        content: counter(alpha-counter, lower-alpha) "." !important;
      }
    `;
    ownerDocument.head.appendChild(styleSheet);

    // ✅ FIX 3: Počkaj na repaint po CSS injekcii
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));

    // ✅ FIX 4: scrollHeight po plnom renderi — zachytí aj tlačidlo na spodku
    const containerWidth  = containerElement.scrollWidth;
    const containerHeight = containerElement.scrollHeight;

    console.log(`📐 Template dimensions: ${containerWidth}×${containerHeight}`);

    const scaleFactor      = STANDARD_WIDTH / containerWidth;
    const highQualityScale = Math.max(scaleFactor, 2);

    // ✅ FIX 5: scrollX/scrollY cez window — nie cez getBoundingClientRect
    // getBoundingClientRect závisí od scroll pozície, pri scrollTo(0,0) je to rect.top
    const rect = containerElement.getBoundingClientRect();

    const screenshot = await html2canvas(containerElement, {
      width:           containerWidth,
      height:          containerHeight,
      scrollX:         -rect.left,
      scrollY:         -rect.top,
      windowWidth:     containerWidth,
      windowHeight:    containerHeight,  // ✅ celá výška — nie viewport
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: '#FFFFFF',
      scale:           highQualityScale,
      logging:         false,
      removeContainer: false,
      foreignObjectRendering: false,
      imageTimeout:    0,
      letterRendering: true,
      // ✅ FIX 6: onclone — aplikuj fix aj na klonovaný DOM ktorý html2canvas používa
      onclone: (clonedDoc, clonedElement) => {
        const clonedStyle = clonedDoc.createElement('style');
        clonedStyle.textContent = `
          ${styleSheet.textContent}

          /* ✅ FIX biely pruh vpravo — skry scrollbar */
          body {
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
          }
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `;
        clonedDoc.head.appendChild(clonedStyle);
      },

    });

    if (styleSheet?.parentNode) ownerDocument.head.removeChild(styleSheet);

    const originalBlob = await new Promise(resolve =>
      screenshot.toBlob(b => resolve(b), 'image/png', 0.95)
    );
    if (!originalBlob) throw new Error('Failed to create blob');

    const resizeResult = await resizeImageToStandardHighQuality(originalBlob, STANDARD_WIDTH);
    const base64Image  = await blobToBase64(resizeResult.blob);

    const response = await fetch('/api/upload-component-template', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64Image,
        contentId,
        contentType,
        dimensions: { width: resizeResult.width, height: resizeResult.height },
      }),
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

    const result = await response.json();
    console.log(`✅ Template uploaded: ${resizeResult.width}×${resizeResult.height}`);
    return result.data?.url;

  } catch (error) {
    console.error('❌ Template generation failed:', error);
    if (styleSheet?.parentNode) {
      try { (containerElement?.ownerDocument || document).head.removeChild(styleSheet); } catch (e) {}
    }
    return null;
  }
};


export const sendTrackingData = async (trackingData) => {
  try {
    const response = await fetch('/api/save-tracking', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Failed to send tracking data:', error);
    throw error;
  }
};

export const fetchTrackingData = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response    = await fetch(`/api/get-tracking?${queryParams}`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Failed to fetch tracking data:', error);
    throw error;
  }
};
