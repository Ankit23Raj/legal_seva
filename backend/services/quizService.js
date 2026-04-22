import QuizResult from '../models/QuizResult.js';
import { AppError } from '../middlewares/errorHandler.js';

class QuizService {
  // Submit quiz result
  async submitQuiz(quizData, user) {
    const result = await QuizResult.create({
      ...quizData,
      user: user.id,
    });

    return result;
  }

  // Get user's quiz results
  async getUserQuizResults(userId) {
    const results = await QuizResult.find({ user: userId })
      .sort({ createdAt: -1 });

    return results;
  }

  // Get quiz statistics for a user
  async getUserQuizStats(userId) {
    const results = await QuizResult.find({ user: userId });

    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        totalPassed: 0,
        totalFailed: 0,
      };
    }

    const totalQuizzes = results.length;
    const totalPassed = results.filter(r => r.passed).length;
    const totalFailed = totalQuizzes - totalPassed;
    const averageScore = results.reduce((acc, r) => acc + r.percentage, 0) / totalQuizzes;

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore * 100) / 100,
      totalPassed,
      totalFailed,
    };
  }

  // Get global quiz statistics
  async getGlobalQuizStats() {
    const totalResults = await QuizResult.countDocuments();
    
    if (totalResults === 0) {
      return {
        totalResults: 0,
        averageScore: 0,
        passRate: 0,
      };
    }

    const results = await QuizResult.find();
    const totalPassed = results.filter(r => r.passed).length;
    const averageScore = results.reduce((acc, r) => acc + r.percentage, 0) / totalResults;

    return {
      totalResults,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round((totalPassed / totalResults) * 10000) / 100,
    };
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    const leaderboard = await QuizResult.aggregate([
      {
        $group: {
          _id: '$user',
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          totalPassed: {
            $sum: { $cond: ['$passed', 1, 0] },
          },
        },
      },
      { $sort: { averageScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          totalQuizzes: 1,
          averageScore: { $round: ['$averageScore', 2] },
          totalPassed: 1,
        },
      },
    ]);

    return leaderboard;
  }
}

export default new QuizService();
