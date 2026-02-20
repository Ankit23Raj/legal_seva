import express from 'express';
import quizController from '../controllers/quizController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { submitQuizValidation } from '../middlewares/validator.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

// Quiz result routes
router.post('/submit', submitQuizValidation, quizController.submitQuiz);
router.get('/user', quizController.getUserQuizResults);
router.get('/user/stats', quizController.getUserQuizStats);
router.get('/stats', quizController.getGlobalQuizStats);
router.get('/leaderboard', quizController.getLeaderboard);

export default router;
