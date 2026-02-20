import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';

const normalizeRole = (role) => {
  if (!role) return 'local';
  const key = String(role).toLowerCase().replace(/[-_\s]+/g, '');
  if (key === 'client') return 'local';
  if (key === 'lawstudent') return 'student';
  if (['local', 'student', 'admin'].includes(key)) return key;
  return 'local';
};

class AuthService {
  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_IN,
      }
    );
  }

  // Register new user
  async register({ name, email, password, role }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const normalizedRole = normalizeRole(role);

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: user.toPublicJSON(),
      token,
    };
  }

  // Login user
  async login({ email, password }) {
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    // Normalize role for downstream consumers (handles legacy values)
    user.role = normalizeRole(user.role);

    const token = this.generateToken(user);

    return {
      user: user.toPublicJSON(),
      token,
    };
  }

  // Verify token
  async verifyUserToken(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.toPublicJSON();
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.toPublicJSON();
  }
}

export default new AuthService();
