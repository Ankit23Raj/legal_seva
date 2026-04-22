import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // MongoDB
  // Prefer `MONGODB_URI` (existing) but also support `MONGO_URI` (common convention).
  // Default binds to 127.0.0.1 (not localhost) to avoid IPv6/hosts-file surprises.
  MONGODB_URI:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/legal_seva',
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // Validation
  isProduction: function() {
    return this.NODE_ENV === 'production';
  },
  
  isDevelopment: function() {
    return this.NODE_ENV === 'development';
  }
};

// Validate critical config
if (!config.JWT_SECRET || config.JWT_SECRET === 'fallback-secret-change-in-production') {
  console.warn('⚠️  WARNING: Using fallback JWT_SECRET. Set JWT_SECRET in .env file!');
}

if (!config.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI (or MONGO_URI) is not defined in .env file');
  process.exit(1);
}

export default config;
