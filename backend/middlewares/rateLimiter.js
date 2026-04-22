import rateLimit from 'express-rate-limit';
import config from '../config/env.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: config.isDevelopment() ? 60 * 1000 : 15 * 60 * 1000, // 1 min in dev, 15 min in prod
  max: config.isDevelopment() ? 50 : 5, // Allow more retries in dev to avoid accidental lockouts
  message: config.isDevelopment()
    ? 'Too many auth attempts from this IP, please slow down.'
    : 'Too many login attempts from this IP, please try again after 15 minutes.',
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: 'Too many file uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
