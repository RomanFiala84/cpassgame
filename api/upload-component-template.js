// api/upload-component-template.js

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
      sizeLimit: '15mb', // ✅ zvýšené pre 1920px templates
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
    const { imageBase64, contentId, contentType, dimensions } = req.body;

    // ✅ Validuj všetky povinné polia
    if (!imageBase64 || !contentId || !contentType) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // ✅ Sanituj contentId — zabraň path traversal v public_id
    const safeContentId = String(contentId).replace(/[^a-zA-Z0-9_-]/g, '_');

    console.log('📥 Uploading component template:', safeContentId, dimensions);

    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder:        'conspiracy-app/component-templates',
      public_id:     `template_${safeContentId}`, // ✅ sanitované
      resource_type: 'image',
      format:        'png',
      quality:       'auto:best',
      overwrite:     true,
      tags: [
        'component-template',
        contentType,
        safeContentId,
        `${dimensions?.width ?? 1920}x${dimensions?.height ?? 2000}`,
      ],
      context: {
        contentId:   safeContentId,
        contentType: contentType,
        width:       dimensions?.width  ?? 1920,
        height:      dimensions?.height ?? 2000,
        createdAt:   new Date().toISOString(),
      },
    });

    console.log('✅ Component template uploaded:', uploadResult.secure_url);

    return res.status(200).json({
      success: true,
      data: {
        url:      uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width:    uploadResult.width,
        height:   uploadResult.height,
      },
    });

  } catch (error) {
    console.error('❌ Template upload error:', error);
    return res.status(500).json({
      success: false,
      error:   'Upload failed',
      details: error.message,
    });
  }
}
