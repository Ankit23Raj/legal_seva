import Issue from '../models/Issue.js';
import { AppError } from '../middlewares/errorHandler.js';

const isClientRole = (role) => role === 'client' || role === 'local';

class IssueService {
  // Create new issue
  async createIssue(issueData, user) {
    if (!isClientRole(user.role)) {
      throw new AppError('Only clients can post issues', 403);
    }

    const issue = await Issue.create({
      ...issueData,
      client: user.id,
      clientEmail: user.email,
      clientName: user.name,
    });

    return await issue.populate('client', 'name email role');
  }

  // Get all issues with optional filters
  async getIssues(filters = {}, user) {
    const query = {};

    // If user is a client, only show their issues
    if (isClientRole(user.role)) {
      query.client = user.id;
    }

    // Apply status filter if provided
    if (filters.status) {
      query.status = filters.status;
    }

    // Apply category filter if provided
    if (filters.category) {
      query.category = filters.category;
    }

    const issues = await Issue.find(query)
      .populate('client', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return issues;
  }

  // Get single issue by ID
  async getIssueById(issueId, user) {
    const issue = await Issue.findById(issueId)
      .populate('client', 'name email role')
      .populate('assignedTo', 'name email');

    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    // Check if user has access to this issue
    if (isClientRole(user.role) && issue.client._id.toString() !== user.id) {
      throw new AppError('You do not have permission to access this issue', 403);
    }

    return issue;
  }

  // Update issue status
  async updateIssueStatus(issueId, status, user) {
    const issue = await Issue.findById(issueId);

    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    // Check permissions
    if (isClientRole(user.role) && issue.client.toString() !== user.id) {
      throw new AppError('You do not have permission to update this issue', 403);
    }

    issue.status = status;
    await issue.save();

    return await issue.populate('client', 'name email role');
  }

  // Assign issue to student
  async assignIssue(issueId, studentId, user) {
    // Only students can assign issues to themselves
    if (user.role !== 'student') {
      throw new AppError('Only students can assign issues', 403);
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    if (issue.assignedTo) {
      throw new AppError('This issue is already assigned', 400);
    }

    issue.assignedTo = studentId;
    issue.status = 'in-progress';
    await issue.save();

    return await issue.populate(['client', 'assignedTo']);
  }

  // Get issue statistics
  async getIssueStats() {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      byStatus: stats,
      byCategory: categoryStats,
      total: await Issue.countDocuments(),
    };
  }
}

export default new IssueService();
