import express from 'express';
import authController from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { registerValidation, loginValidation } from '../middlewares/validator.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes (with rate limiting)
router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);

// Protected routes
router.get('/verify', verifyToken, authController.verifyToken);
router.get('/me', verifyToken, authController.getMe);

export default router;
