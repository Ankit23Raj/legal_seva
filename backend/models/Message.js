import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
messageSchema.index({ issue: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ isRead: 1 });

// Update readAt when isRead is set to true
messageSchema.pre('save', function (next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
