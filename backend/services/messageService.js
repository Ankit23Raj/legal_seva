import Message from '../models/Message.js';
import Issue from '../models/Issue.js';
import User from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';

const isClientRole = (role) => role === 'client' || role === 'local';

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

    // Determine receiver and ensure the correct parties are chatting
    let receiverId;
    let receiverEmail;
    let receiverName;

    const senderId = String(user.id);
    const issueClientId = issue.client ? String(issue.client?._id || issue.client) : '';
    const issueAssignedId = issue.assignedTo ? String(issue.assignedTo?._id || issue.assignedTo) : '';

    if (user.role === 'student') {
      // If another student is already assigned, prevent hijacking the chat
      if (issue.assignedTo && String(issue.assignedTo) !== senderId) {
        throw new AppError('This issue is already assigned to another student', 403);
      }

      // Auto-assign issue to this student on first reply
      if (!issue.assignedTo) {
        issue.assignedTo = user.id;
        issue.status = 'in-progress';
        await issue.save();
      }

      receiverId = issue.client?._id || issue.client;
      receiverEmail = issue.clientEmail;
      receiverName = issue.clientName;
    } else if (isClientRole(user.role)) {
      // Client can only chat on their own issue
      if (issueClientId !== senderId) {
        throw new AppError('You do not have permission to message on this issue', 403);
      }

      if (!issue.assignedTo) {
        throw new AppError('No student has been assigned to this issue yet', 400);
      }

      receiverId = issue.assignedTo?._id || issue.assignedTo;
      const receiverUser = await User.findById(receiverId).select('email name');
      receiverEmail = receiverUser?.email;
      receiverName = receiverUser?.name;
    } else {
      throw new AppError('You do not have permission to send messages', 403);
    }

    if (!receiverId) {
      throw new AppError('Unable to determine message recipient', 500);
    }

    if (String(receiverId) === senderId) {
      throw new AppError('Cannot send a message to yourself', 400);
    }

    const newMessage = await Message.create({
      issue: issueId,
      sender: user.id,
      receiver: receiverId,
      senderEmail: user.email,
      senderName: user.name,
      receiverEmail,
      receiverName,
      message,
    });

    return await newMessage.populate([
      { path: 'sender', select: 'name email role' },
      { path: 'receiver', select: 'name email role' },
    ]);
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

        const clientId = String(issue.client?._id || issue.client);
        const assignedId = issue.assignedTo ? String(issue.assignedTo?._id || issue.assignedTo) : '';
        const isClient = clientId === user.id;
        const other = isClient ? assignedUser : clientUser;

        return {
          id: issue._id,
          participants: [clientId, assignedId].filter(Boolean),
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

    if (isClientRole(user.role) && issue.client.toString() !== user.id) {
      throw new AppError('You do not have permission to view these messages', 403);
    }

    if (user.role === 'student') {
      // If another student owns the issue, block access
      if (issue.assignedTo && issue.assignedTo.toString() !== user.id) {
        throw new AppError('You do not have permission to view these messages', 403);
      }
    }

    const messages = await Message.find({ issue: issueId })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
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
