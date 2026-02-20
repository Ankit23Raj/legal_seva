import quizService from '../services/quizService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class QuizController {
  // @route   POST /api/quiz-results/submit
  // @desc    Submit quiz result
  // @access  Private
  submitQuiz = asyncHandler(async (req, res) => {
    const result = await quizService.submitQuiz(req.body, req.user);

    res.status(201).json({
      success: true,
      message: 'Quiz result submitted successfully',
      data: { result },
    });
  });

  // @route   GET /api/quiz-results/user
  // @desc    Get user's quiz results
  // @access  Private
  getUserQuizResults = asyncHandler(async (req, res) => {
    const results = await quizService.getUserQuizResults(req.user.id);

    res.status(200).json({
      success: true,
      count: results.length,
      data: { results },
    });
  });

  // @route   GET /api/quiz-results/user/stats
  // @desc    Get user's quiz statistics
  // @access  Private
  getUserQuizStats = asyncHandler(async (req, res) => {
    const stats = await quizService.getUserQuizStats(req.user.id);

    res.status(200).json({
      success: true,
      data: { stats },
    });
  });

  // @route   GET /api/quiz-results/stats
  // @desc    Get global quiz statistics
  // @access  Private
  getGlobalQuizStats = asyncHandler(async (req, res) => {
    const stats = await quizService.getGlobalQuizStats();

    res.status(200).json({
      success: true,
      data: { stats },
    });
  });

  // @route   GET /api/quiz-results/leaderboard
  // @desc    Get quiz leaderboard
  // @access  Private
  getLeaderboard = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await quizService.getLeaderboard(limit);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: { leaderboard },
    });
  });
}

export default new QuizController();
