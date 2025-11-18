// api/upload-heatmap.js
// VERCEL SIMPLIFIED VERSION - Upload individuálnych heatmap (1920px)

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb', // ✅ ZVÝŠENÉ z 10mb na 15mb (1920px templates)
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('📥 Received heatmap upload request');

    const { imageBase64, contentId, contentType, userId, trackingId } = req.body;

    if (!imageBase64) {
      console.error('❌ No image data provided');
      return res.status(400).json({ 
        success: false, 
        error: 'No image data provided' 
      });
    }

    // ✅ Zisti veľkosť obrazu
    const imageSizeKB = (imageBase64.length * 0.75 / 1024).toFixed(2); // Base64 je ~33% väčší

    console.log('✅ Image data received:', {
      contentId,
      contentType,
      userId,
      trackingId,
      imageSizeKB: `${imageSizeKB}KB`
    });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: `conspiracy-app/heatmaps/${contentType || 'unknown'}`,
      public_id: `${contentId}_${userId}_${Date.now()}`,
      resource_type: 'image',
      format: 'png',
      quality: 'auto:best',
      
      tags: [
        'heatmap',
        'individual', // ✅ PRIDANÉ - označuje individuálnu heatmap
        contentType || 'unknown',
        contentId || 'unknown',
        `user_${userId || 'unknown'}`,
        new Date().toISOString().split('T')[0]
      ],
      
      context: {
        contentId: contentId || 'unknown',
        contentType: contentType || 'unknown',
        userId: userId || 'unknown',
        trackingId: trackingId || 'unknown',
        timestamp: new Date().toISOString(),
        templateWidth: 1920, // ✅ PRIDANÉ - označuje template width
      },
      
      // ✅ OPRAVENÉ - Eager transformations pre 1920px template
      eager: [
        { width: 600, height: 900, crop: 'fit', quality: 'auto', format: 'webp' }, // Thumbnail
        { width: 1200, height: 1800, crop: 'fit', quality: 'auto:good', format: 'png' } // Medium
      ],
      
      eager_async: true,
      invalidate: true,
    });

    console.log('✅ Cloudinary heatmap upload successful:', {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      size: `${(uploadResult.bytes / 1024).toFixed(2)}KB`,
      dimensions: `${uploadResult.width}×${uploadResult.height}`
    });

    return res.status(200).json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        thumbnailUrl: uploadResult.eager?.[0]?.secure_url,
        mediumUrl: uploadResult.eager?.[1]?.secure_url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        createdAt: uploadResult.created_at
      }
    });

  } catch (error) {
    console.error('❌ Cloudinary heatmap upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Upload failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
