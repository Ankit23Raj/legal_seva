import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import configurations
import config from './config/env.js';
import corsMiddleware from './config/cors.js';
import { connectDB, disconnectDB } from './config/db.js';

// Import middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import issueRoutes from './routes/issues.js';
import messageRoutes from './routes/messages.js';
import quizResultsRoutes from './routes/quizResults.js';
import uploadRoutes from './routes/upload.js';
import studentsRoutes from './routes/students.js';

// Import logger
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
    },
  },
}));

// CORS configuration
app.use(corsMiddleware);

// Logging middleware (only in development)
if (config.isDevelopment()) {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (global)
app.use('/api/', apiLimiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, config.UPLOAD_PATH)));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/quiz-results', quizResultsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/students', studentsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Legal Seva Backend API is running',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Legal Seva Backend API',
    version: '2.0.0',
    documentation: '/api/docs',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await disconnectDB();
  process.exit(0);
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.success(`Server is running on http://localhost:${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`CORS Origin: ${config.FRONTEND_URL}`);
});

export default app;
