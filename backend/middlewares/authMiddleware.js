import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { AppError } from './errorHandler.js';
import { asyncHandler } from './errorHandler.js';

const normalizeRole = (role) => {
  if (!role) return 'client';
  const key = String(role).toLowerCase().replace(/[-_\s]+/g, '');
  if (key === 'local' || key === 'client') return 'client';
  if (key === 'lawstudent') return 'student';
  if (['student', 'admin'].includes(key)) return key;
  return 'client';
};

export const verifyToken = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided. Please authenticate.', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('Invalid token format', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Attach user to request
    req.user = {
      ...decoded,
      id: decoded?.id ? String(decoded.id) : decoded?.id,
      role: normalizeRole(decoded?.role),
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 403);
    } else if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired. Please login again.', 403);
    }
    throw new AppError('Authentication failed', 403);
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};
