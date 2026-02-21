import messageService from '../services/messageService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class MessageController {
  // @route   POST /api/messages
  // @desc    Create new message
  // @access  Private
  createMessage = asyncHandler(async (req, res) => {
    const message = await messageService.createMessage(req.body, req.user);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message },
    });
  });

  // @route   GET /api/messages/:issueId
  // @desc    Get messages for an issue
  // @access  Private
  getMessagesByIssue = asyncHandler(async (req, res) => {
    const messages = await messageService.getMessagesByIssue(req.params.issueId, req.user);

    res.status(200).json({
      success: true,
      count: messages.length,
      data: { messages },
    });
  });

  // @route   GET /api/messages?issueId=:issueId
  // @desc    Get messages for an issue (query param)
  // @access  Private
  getMessagesByIssueQuery = asyncHandler(async (req, res) => {
    const issueId = req.query.issueId;
    const messages = await messageService.getMessagesByIssue(issueId, req.user);

    res.status(200).json({
      success: true,
      count: messages.length,
      data: { messages },
    });
  });

  // @route   PATCH /api/messages/:id/read
  // @desc    Mark message as read
  // @access  Private
  markAsRead = asyncHandler(async (req, res) => {
    const message = await messageService.markAsRead(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: { message },
    });
  });

  // @route   GET /api/messages/unread/count
  // @desc    Get unread message count
  // @access  Private
  getUnreadCount = asyncHandler(async (req, res) => {
    const result = await messageService.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // @route   GET /api/messages/conversations
  // @desc    Get conversations for current user
  // @access  Private
  getConversations = asyncHandler(async (req, res) => {
    const conversations = await messageService.getConversations(req.user);

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: { conversations },
    });
  });
}

export default new MessageController();
