import express from 'express';
import messageController from '../controllers/messageController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { createMessageValidation, issueIdQueryValidation, issueIdValidation, mongoIdValidation } from '../middlewares/validator.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

// Message routes
router.post('/', createMessageValidation, messageController.createMessage);
router.get('/', issueIdQueryValidation, messageController.getMessagesByIssueQuery);
router.get('/conversations', messageController.getConversations);
router.get('/unread/count', messageController.getUnreadCount);
router.get('/:issueId', issueIdValidation, messageController.getMessagesByIssue);
router.patch('/:id/read', mongoIdValidation, messageController.markAsRead);

export default router;
