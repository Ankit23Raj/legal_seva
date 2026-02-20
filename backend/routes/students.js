import express from 'express';
import studentController from '../controllers/studentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

router.get('/verification-status', studentController.getVerificationStatus);
router.post('/verify-id', studentController.submitVerification);

export default router;
