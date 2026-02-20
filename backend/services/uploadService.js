import cloudinary from '../config/cloudinary.js';
import config from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';
import fs from 'fs';
import path from 'path';

class UploadService {
  /**
   * Upload file to Cloudinary
   * @param {Object} file - File object from multer
   * @param {String} folder - Cloudinary folder name
   * @returns {Promise<Object>} - Upload result with URL
   */
  async uploadToCloudinary(file, folder = 'legal-seva') {
    try {
      // Check if Cloudinary is configured
      if (!config.CLOUDINARY_CLOUD_NAME) {
        // Fallback to local storage
        return this.saveLocally(file);
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      });

      // Delete local file after uploading to cloud
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      // Clean up local file if upload fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new AppError(`File upload failed: ${error.message}`, 500);
    }
  }

  /**
   * Save file locally (fallback)
   * @param {Object} file - File object from multer
   * @returns {Object} - File info with local URL
   */
  saveLocally(file) {
    const fileUrl = `/uploads/${file.filename}`;
    
    return {
      url: fileUrl,
      publicId: file.filename,
      format: path.extname(file.originalname).slice(1),
      size: file.size,
    };
  }

  /**
   * Delete file from Cloudinary
   * @param {String} publicId - Cloudinary public ID
   */
  async deleteFromCloudinary(publicId) {
    try {
      if (!config.CLOUDINARY_CLOUD_NAME) {
        // Delete local file
        const filePath = path.join(config.UPLOAD_PATH, publicId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return;
      }

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of file objects
   * @param {String} folder - Cloudinary folder name
   * @returns {Promise<Array>} - Array of upload results
   */
  async uploadMultiple(files, folder = 'legal-seva') {
    const uploadPromises = files.map(file => this.uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  }

  /**
   * Validate file type
   * @param {Object} file - File object
   * @param {Array} allowedTypes - Array of allowed MIME types
   * @throws {AppError} - If file type is not allowed
   */
  validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        400
      );
    }
  }

  /**
   * Validate file size
   * @param {Object} file - File object
   * @param {Number} maxSize - Maximum file size in bytes
   * @throws {AppError} - If file size exceeds limit
   */
  validateFileSize(file, maxSize = config.MAX_FILE_SIZE) {
    if (file.size > maxSize) {
      throw new AppError(
        `File size exceeds limit. Maximum size: ${maxSize / 1024 / 1024}MB`,
        400
      );
    }
  }
}

export default new UploadService();
