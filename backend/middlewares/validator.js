import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Validation result handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    throw new AppError(
      `Validation failed: ${errorMessages.map(e => `${e.field}: ${e.message}`).join(', ')}`,
      400
    );
  }
  next();
};

// Auth validation rules
export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name should only contain letters and spaces'),
  body('role')
    .optional()
    .isString()
    .trim()
    .custom((value) => {
      const normalized = String(value).toLowerCase().replace(/[-_\s]+/g, '');
      return ['local', 'student', 'admin', 'client', 'lawstudent'].includes(normalized);
    })
    .withMessage('Role must be one of: local, student, admin, client, lawstudent'),
  validate
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Issue validation rules
export const createIssueValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('preferredLanguage')
    .isIn(['en', 'hi'])
    .withMessage('Language must be either en or hi'),
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array'),
  validate
];

export const updateIssueStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid issue ID'),
  body('status')
    .isIn(['new', 'in-progress', 'resolved', 'closed'])
    .withMessage('Status must be one of: new, in-progress, resolved, closed'),
  validate
];

// Message validation rules
export const createMessageValidation = [
  body('issueId')
    .isMongoId()
    .withMessage('Invalid issue ID'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  validate
];

// Quiz validation rules
export const submitQuizValidation = [
  body('categoryId')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required'),
  body('levelId')
    .trim()
    .notEmpty()
    .withMessage('Level ID is required'),
  body('score')
    .isInt({ min: 0 })
    .withMessage('Score must be a non-negative integer'),
  body('totalQuestions')
    .isInt({ min: 1 })
    .withMessage('Total questions must be at least 1'),
  body('timeTaken')
    .isInt({ min: 0 })
    .withMessage('Time taken must be a non-negative integer'),
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),
  validate
];

// ID param validation
export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate
];
