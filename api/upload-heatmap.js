// api/upload-heatmap.js

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'http://localhost:3000'); // ✅
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('📥 Received heatmap upload request');

    const { imageBase64, contentId, contentType, userId, trackingId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    // ✅ Sanituj contentId a userId
    const safeContentId = String(contentId || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeUserId    = String(userId    || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');

    const imageSizeKB = (imageBase64.length * 0.75 / 1024).toFixed(2);

    console.log('✅ Image data received:', {
      contentId:    safeContentId,
      contentType,
      userId:       safeUserId,
      trackingId,
      imageSizeKB:  `${imageSizeKB}KB`,
    });

    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder:        `conspiracy-app/heatmaps/${contentType || 'unknown'}`,
      public_id:     `${safeContentId}_${safeUserId}_${Date.now()}`, // ✅ sanitované
      resource_type: 'image',
      format:        'png',
      quality:       'auto:best',
      eager_async:   true,
      invalidate:    true,
      tags: [
        'heatmap',
        'individual',
        contentType  || 'unknown',
        safeContentId,
        `user_${safeUserId}`,
        new Date().toISOString().split('T')[0],
      ],
      context: {
        contentId:     safeContentId,
        contentType:   contentType   || 'unknown',
        userId:        safeUserId,
        trackingId:    trackingId    || 'unknown',
        timestamp:     new Date().toISOString(),
        templateWidth: 1920,
      },
      eager: [
        { width: 600,  height: 900,  crop: 'fit', quality: 'auto',      format: 'webp' },
        { width: 1200, height: 1800, crop: 'fit', quality: 'auto:good', format: 'png'  },
      ],
    });

    console.log('✅ Cloudinary heatmap upload successful:', {
      publicId:   uploadResult.public_id,
      url:        uploadResult.secure_url,
      size:       `${(uploadResult.bytes / 1024).toFixed(2)}KB`,
      dimensions: `${uploadResult.width}×${uploadResult.height}`,
    });

    // ✅ Generuj thumbnail/medium URL deterministicky — nezávisí od eager_async stavu
    const baseUrl    = uploadResult.secure_url;
    const thumbUrl   = baseUrl.replace('/upload/', '/upload/w_600,h_900,c_fit,q_auto,f_webp/');
    const mediumUrl  = baseUrl.replace('/upload/', '/upload/w_1200,h_1800,c_fit,q_auto:good,f_png/');

    return res.status(200).json({
      success: true,
      data: {
        url:          uploadResult.secure_url,
        publicId:     uploadResult.public_id,
        thumbnailUrl: uploadResult.eager?.[0]?.secure_url || thumbUrl,   // ✅ fallback
        mediumUrl:    uploadResult.eager?.[1]?.secure_url || mediumUrl,  // ✅ fallback
        format:       uploadResult.format,
        width:        uploadResult.width,
        height:       uploadResult.height,
        bytes:        uploadResult.bytes,
        createdAt:    uploadResult.created_at,
      },
    });

  } catch (error) {
    console.error('❌ Cloudinary heatmap upload error:', error);
    return res.status(500).json({
      success: false,
      error:   'Upload failed',
      details: error.message,
      stack:   process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
