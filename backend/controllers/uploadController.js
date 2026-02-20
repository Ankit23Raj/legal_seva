import uploadService from '../services/uploadService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';

class UploadController {
  // @route   POST /api/upload/student-id
  // @desc    Upload student ID document
  // @access  Private
  uploadStudentId = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Validate file
    uploadService.validateFileType(req.file);
    uploadService.validateFileSize(req.file);

    // Upload to cloudinary
    const uploadResult = await uploadService.uploadToCloudinary(
      req.file,
      'legal-seva/student-ids'
    );

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: { file: uploadResult },
    });
  });

  // @route   POST /api/upload/issue-document
  // @desc    Upload issue document
  // @access  Private
  uploadIssueDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Validate file
    uploadService.validateFileType(req.file);
    uploadService.validateFileSize(req.file);

    // Upload to cloudinary
    const uploadResult = await uploadService.uploadToCloudinary(
      req.file,
      'legal-seva/issue-documents'
    );

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { file: uploadResult },
    });
  });

  // @route   POST /api/upload/multiple
  // @desc    Upload multiple files
  // @access  Private
  uploadMultiple = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // Validate all files
    req.files.forEach(file => {
      uploadService.validateFileType(file);
      uploadService.validateFileSize(file);
    });

    // Upload all files
    const uploadResults = await uploadService.uploadMultiple(
      req.files,
      'legal-seva/documents'
    );

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      count: uploadResults.length,
      data: { files: uploadResults },
    });
  });
}

export default new UploadController();
