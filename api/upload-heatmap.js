// api/upload-heatmap.js
// VERCEL SIMPLIFIED VERSION - Direct base64 upload without formidable

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
      sizeLimit: '10mb',
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
    console.log('📥 Received upload request');

    const { imageBase64, contentId, contentType, userId, trackingId } = req.body;

    if (!imageBase64) {
      console.error('❌ No image data provided');
      return res.status(400).json({ 
        success: false, 
        error: 'No image data provided' 
      });
    }

    console.log('✅ Image data received:', {
      contentId,
      contentType,
      userId,
      trackingId,
      imageSize: imageBase64.length
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
      },
      
      eager: [
        { width: 400, height: 600, crop: 'fit', quality: 'auto', format: 'webp' },
        { width: 1000, height: 1500, crop: 'fit', quality: 'auto:good', format: 'png' }
      ],
      
      eager_async: true,
      invalidate: true,
    });

    console.log('✅ Cloudinary upload successful:', {
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
      size: uploadResult.bytes
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
    console.error('❌ Cloudinary upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Upload failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
