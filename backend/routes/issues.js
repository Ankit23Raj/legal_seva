import express from 'express';
import issueController from '../controllers/issueController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  createIssueValidation,
  updateIssueStatusValidation,
  mongoIdValidation,
} from '../middlewares/validator.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

// Issue routes
router.get('/', issueController.getIssues);
router.get('/stats', issueController.getIssueStats);
router.get('/:id', mongoIdValidation, issueController.getIssueById);
router.post('/', createIssueValidation, issueController.createIssue);
router.patch('/:id/status', updateIssueStatusValidation, issueController.updateIssueStatus);
router.post('/:id/assign', mongoIdValidation, issueController.assignIssue);

export default router;
