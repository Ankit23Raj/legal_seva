import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    levelId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    answers: [{
      type: String,
    }],
    timeTaken: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizResultSchema.index({ user: 1, createdAt: -1 });
quizResultSchema.index({ categoryId: 1, levelId: 1 });

// Calculate percentage and passed status before saving
quizResultSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('score') || this.isModified('totalQuestions')) {
    this.percentage = (this.score / this.totalQuestions) * 100;
    this.passed = this.percentage >= 60; // 60% passing score
  }
  next();
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
