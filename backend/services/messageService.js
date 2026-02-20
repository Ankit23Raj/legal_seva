import Message from '../models/Message.js';
import Issue from '../models/Issue.js';
import { AppError } from '../middlewares/errorHandler.js';

class MessageService {
  // Create new message
  async createMessage(messageData, user) {
    const issueId = messageData.issueId || messageData.conversationId;
    const { message } = messageData;

    if (!issueId) {
      throw new AppError('Issue ID is required', 400);
    }

    // Verify issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    // Check if user has access to this issue
    if (
      user.role === 'local' &&
      issue.client.toString() !== user.id
    ) {
      throw new AppError('You do not have permission to message on this issue', 403);
    }

    const newMessage = await Message.create({
      issue: issueId,
      sender: user.id,
      senderEmail: user.email,
      senderName: user.name,
      message,
    });

    return await newMessage.populate('sender', 'name email role');
  }

  // Get conversations (issues the user is involved in) with last message metadata
  async getConversations(user) {
    const issues = await Issue.find({
      $or: [{ client: user.id }, { assignedTo: user.id }],
    })
      .populate('client', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ updatedAt: -1, createdAt: -1 });

    const conversations = await Promise.all(
      issues.map(async (issue) => {
        const lastMessage = await Message.findOne({ issue: issue._id })
          .sort({ createdAt: -1 })
          .select('message createdAt');

        const hasUnread = await Message.exists({
          issue: issue._id,
          sender: { $ne: user.id },
          isRead: false,
        });

        const clientUser = issue.client && typeof issue.client === 'object' ? issue.client : null;
        const assignedUser = issue.assignedTo && typeof issue.assignedTo === 'object' ? issue.assignedTo : null;

        const isClient = issue.client?.toString?.() === user.id;
        const other = isClient ? assignedUser : clientUser;

        return {
          id: issue._id,
          participants: [issue.client?.toString?.() || String(issue.client), issue.assignedTo?.toString?.() || (issue.assignedTo ? String(issue.assignedTo) : '')].filter(Boolean),
          lastMessage: lastMessage?.message || '',
          lastMessageTime: (lastMessage?.createdAt || issue.updatedAt || issue.createdAt).toISOString(),
          unread: Boolean(hasUnread),
          otherUser: other
            ? {
                id: other._id,
                fullName: other.name,
                email: other.email,
                role: other.role,
              }
            : undefined,
        };
      })
    );

    return conversations;
  }

  // Get messages for an issue
  async getMessagesByIssue(issueId, user) {
    // Verify issue exists and user has access
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    if (user.role === 'local' && issue.client.toString() !== user.id) {
      throw new AppError('You do not have permission to view these messages', 403);
    }

    const messages = await Message.find({ issue: issueId })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 });

    return messages;
  }

  // Mark message as read
  async markAsRead(messageId, user) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    // Only the recipient can mark as read (not the sender)
    if (message.sender.toString() === user.id) {
      throw new AppError('You cannot mark your own message as read', 400);
    }

    message.isRead = true;
    await message.save();

    return message;
  }

  // Get unread message count for user
  async getUnreadCount(userId) {
    // Get all issues where user is involved
    const userIssues = await Issue.find({
      $or: [
        { client: userId },
        { assignedTo: userId },
      ],
    }).select('_id');

    const issueIds = userIssues.map(issue => issue._id);

    const unreadCount = await Message.countDocuments({
      issue: { $in: issueIds },
      sender: { $ne: userId },
      isRead: false,
    });

    return { unreadCount };
  }
}

export default new MessageService();
