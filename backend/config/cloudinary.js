import { v2 as cloudinary } from 'cloudinary';
import config from './env.js';

// Configure Cloudinary
if (config.CLOUDINARY_CLOUD_NAME && config.CLOUDINARY_API_KEY && config.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
  });
  
  console.log('✅ Cloudinary configured');
} else {
  console.warn('⚠️  Cloudinary not configured. File uploads will use local storage.');
}

export default cloudinary;
