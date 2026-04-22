import authService from '../services/authService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class AuthController {
  // @route   POST /api/auth/register
  // @desc    Register new user
  // @access  Public
  register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const result = await authService.register({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  // @route   POST /api/auth/login
  // @desc    Login user
  // @access  Public
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  // @route   GET /api/auth/verify
  // @desc    Verify token and get user
  // @access  Private
  verifyToken = asyncHandler(async (req, res) => {
    const user = await authService.verifyUserToken(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  });

  // @route   GET /api/auth/me
  // @desc    Get current user
  // @access  Private
  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  });
}

export default new AuthController();
