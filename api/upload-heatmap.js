// api/upload-heatmap.js
// Upload PNG heatmap obrázkov do Cloudinary

import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const config = {
  api: {
    bodyParser: false,
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
    const form = formidable({ 
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true 
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ success: false, error: 'Upload failed', details: err.message });
      }

      const { contentId, contentType, userId, trackingId } = fields;
      const imageFile = files.image;

      if (!imageFile) {
        return res.status(400).json({ success: false, error: 'No image file provided' });
      }

      // Upload do Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: `conspiracy-app/heatmaps/${contentType}`,
        public_id: `${contentId}_${userId}_${Date.now()}`,
        resource_type: 'image',
        format: 'png',
        quality: 'auto:best',
        
        tags: [
          'heatmap',
          contentType,
          contentId,
          `user_${userId}`,
          new Date().toISOString().split('T')[0]
        ],
        
        context: {
          contentId: contentId,
          contentType: contentType,
          userId: userId,
          trackingId: trackingId,
          timestamp: new Date().toISOString(),
        },
        
        eager: [
          { width: 400, height: 600, crop: 'fit', quality: 'auto', format: 'webp' },
          { width: 1000, height: 1500, crop: 'fit', quality: 'auto:good', format: 'png' }
        ],
        
        eager_async: true,
        invalidate: true,
      });

      console.log('✅ Cloudinary upload successful:', uploadResult.secure_url);

      res.status(200).json({
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
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed',
      details: error.message 
    });
  }
}
