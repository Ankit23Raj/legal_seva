import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    preferredLanguage: {
      type: String,
      required: [true, 'Preferred language is required'],
      enum: ['en', 'hi'],
      default: 'en',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    documents: [{
      type: String, // URLs to uploaded documents
    }],
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'closed'],
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
issueSchema.index({ client: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ clientEmail: 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
