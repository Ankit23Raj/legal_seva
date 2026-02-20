import User from '../models/User.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class StudentController {
  // @route   GET /api/students/verification-status
  // @desc    Get current user's verification status
  // @access  Private
  getVerificationStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        verified: Boolean(user.isVerified),
        status: user.verificationStatus,
        documentUrl: user.verificationDocument,
      },
    });
  });

  // @route   POST /api/students/verify-id
  // @desc    Submit verification document URL for current user
  // @access  Private
  submitVerification = asyncHandler(async (req, res) => {
    const { documentUrl } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Store document + mark verified for local dev (no admin review flow implemented).
    user.verificationDocument = documentUrl;
    user.verificationStatus = 'approved';
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Verification submitted',
      data: {
        verified: Boolean(user.isVerified),
        status: user.verificationStatus,
      },
    });
  });
}

export default new StudentController();
