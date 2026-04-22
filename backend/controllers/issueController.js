import issueService from '../services/issueService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class IssueController {
  // @route   GET /api/issues
  // @desc    Get all issues (filtered by role)
  // @access  Private
  getIssues = asyncHandler(async (req, res) => {
    const { status, category } = req.query;
    const filters = { status, category };

    const issues = await issueService.getIssues(filters, req.user);

    res.status(200).json({
      success: true,
      count: issues.length,
      data: { issues },
    });
  });

  // @route   GET /api/issues/:id
  // @desc    Get single issue
  // @access  Private
  getIssueById = asyncHandler(async (req, res) => {
    const issue = await issueService.getIssueById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: { issue },
    });
  });

  // @route   POST /api/issues
  // @desc    Create new issue
  // @access  Private
  createIssue = asyncHandler(async (req, res) => {
    const issue = await issueService.createIssue(req.body, req.user);

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: { issue },
    });
  });

  // @route   PATCH /api/issues/:id/status
  // @desc    Update issue status
  // @access  Private
  updateIssueStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const issue = await issueService.updateIssueStatus(req.params.id, status, req.user);

    res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      data: { issue },
    });
  });

  // @route   POST /api/issues/:id/assign
  // @desc    Assign issue to student
  // @access  Private (Student only)
  assignIssue = asyncHandler(async (req, res) => {
    const issue = await issueService.assignIssue(req.params.id, req.user.id, req.user);

    res.status(200).json({
      success: true,
      message: 'Issue assigned successfully',
      data: { issue },
    });
  });

  // @route   GET /api/issues/stats
  // @desc    Get issue statistics
  // @access  Private
  getIssueStats = asyncHandler(async (req, res) => {
    const stats = await issueService.getIssueStats();

    res.status(200).json({
      success: true,
      data: { stats },
    });
  });
}

export default new IssueController();
