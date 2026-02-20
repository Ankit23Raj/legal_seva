import cors from 'cors';
import config from './env.js';

const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
];

// Add production URLs if in production
if (config.isProduction()) {
  // Add your production frontend URLs here
  // allowedOrigins.push('https://your-production-domain.com');
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

// Export the CORS middleware directly
export default cors(corsOptions);
