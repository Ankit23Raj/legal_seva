# Legal Seva - Full Stack Web Application

## 📋 Overview

Legal Seva is a comprehensive legal assistance platform connecting local advocates and law students with clients seeking legal help. The platform features multilingual support, educational quizzes, real-time messaging, and document management.

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **MVC Architecture**: Clean separation of concerns with Models, Views (JSON responses), and Controllers
- **Service Layer**: Business logic isolated from HTTP layer
- **MongoDB**: Production-ready database with Mongoose ODM
- **Security**: JWT authentication, helmet.js, CORS, rate limiting, input validation
- **File Storage**: Cloudinary integration with local fallback

### Frontend (React + TypeScript + Vite)
- **Component-Based Architecture**: Reusable UI components with shadcn/ui
- **Context API**: Global state management for auth, theme, and language
- **Type-Safe**: Full TypeScript coverage
- **Modern Build**: Vite for fast development and optimized production builds

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x (or MongoDB Atlas account)
- npm or yarn
- Git

### Backend Setup

1. **Clone and navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `JWT_SECRET`: Already set to a secure value
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLOUDINARY_*`: (Optional) Cloudinary credentials

4. **Start MongoDB** (if running locally):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

5. **Migrate existing data** (optional):
   ```bash
   npm run migrate
   ```

6. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   Server will run at `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd oooooooo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   Frontend will run at `http://localhost:5173`

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── env.js          # Environment variables
│   ├── cors.js         # CORS configuration
│   ├── db.js           # Database connection
│   └── cloudinary.js   # Cloudinary setup
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── issueController.js
│   ├── messageController.js
│   ├── quizController.js
│   └── uploadController.js
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Issue.js
│   ├── Message.js
│   └── QuizResult.js
├── services/           # Business logic
│   ├── authService.js
│   ├── issueService.js
│   ├── messageService.js
│   ├── quizService.js
│   └── uploadService.js
├── middlewares/        # Express middlewares
│   ├── authMiddleware.js   # JWT verification
│   ├── errorHandler.js     # Global error handling
│   ├── rateLimiter.js      # Rate limiting
│   └── validator.js        # Input validation
├── routes/             # API routes
│   ├── auth.js
│   ├── issues.js
│   ├── messages.js
│   ├── quizResults.js
│   └── upload.js
├── utils/              # Utility functions
│   ├── logger.js
│   ├── response.js
│   └── dateHelpers.js
├── scripts/            # Migration and utility scripts
│   └── migrate.js
├── uploads/            # Local file storage
├── .env.example        # Environment template
├── .gitignore
├── package.json
└── server.js           # Entry point

oooooooo/ (frontend)
├── src/
│   ├── components/     # React components
│   ├── contexts/       # Context providers
│   ├── hooks/          # Custom hooks
│   ├── lib/           # Utilities and API clients
│   ├── pages/         # Page components
│   └── integrations/  # Third-party integrations
├── public/            # Static assets
├── index.html
├── vite.config.ts
└── package.json
```

## 🔐 Security Features

### Backend Security
- ✅ JWT authentication with secure secret
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Helmet.js for HTTP security headers
- ✅ CORS with origin whitelist
- ✅ Rate limiting (3-tier: API, Auth, Upload)
- ✅ Input validation with express-validator
- ✅ MongoDB injection prevention
- ✅ File upload validation (type & size)
- ✅ Centralized error handling
- ✅ Environment-specific error messages
- ✅ Secure session management (1-hour expiration)

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong MongoDB password
- [ ] Configure Cloudinary for file storage
- [ ] Set proper CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review rate limiting thresholds

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "local",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "local"
    }
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Issues

#### Get All Issues
```http
GET /api/issues
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: Filter by status (pending, in-progress, resolved)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Create Issue
```http
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Property Dispute",
  "description": "Need help with property ownership dispute",
  "category": "property",
  "documents": ["https://cloudinary.com/..."]
}
```

#### Update Issue Status
```http
PATCH /api/issues/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

### Messages

#### Get Messages for Issue
```http
GET /api/messages/:issueId
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "issueId": "...",
  "content": "I can help with this case"
}
```

### Quizzes

#### Submit Quiz Result
```http
POST /api/quiz-results/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "quiz_1",
  "quizTitle": "Indian Penal Code Basics",
  "score": 8,
  "totalQuestions": 10
}
```

#### Get User Quiz Stats
```http
GET /api/quiz-results/user/stats
Authorization: Bearer <token>
```

#### Get Leaderboard
```http
GET /api/quiz-results/leaderboard
Authorization: Bearer <token>
```

### File Upload

#### Upload Student ID
```http
POST /api/upload/student-id
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: <file>
```

#### Upload Issue Document
```http
POST /api/upload/issue-document
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: <file>
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]  // Optional validation errors
}
```

## 🧪 Testing

### Test API with curl

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "local"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Get issues (replace TOKEN)
curl http://localhost:5001/api/issues \
  -H "Authorization: Bearer TOKEN"
```

## 🚢 Deployment

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal-seva?retryWrites=true&w=majority
   ```

### Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get credentials from dashboard
3. Update `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Deploy Backend (Render/Railway/Heroku)

1. **Create new web service**
2. **Connect GitHub repository**
3. **Configure environment variables** (copy from `.env`)
4. **Build command**: `npm install`
5. **Start command**: `npm start`

### Deploy Frontend (Vercel/Netlify)

1. **Create new project**
2. **Connect GitHub repository**
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment variables**:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

## 🛠️ Development

### Database Migration

Migrate data from JSON files to MongoDB:

```bash
npm run migrate
```

This will:
- Read data from `data/*.json` files
- Create MongoDB documents
- Maintain relationships
- Skip duplicates
- Show migration statistics

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run migrate` - Migrate JSON data to MongoDB

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Code Style

- **ESLint**: Configured for React + TypeScript
- **Prettier**: Code formatting
- **Naming**: camelCase for variables, PascalCase for components

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh

# Check connection string in .env
echo $MONGODB_URI
```

### CORS Errors
Update `backend/config/cors.js` to include your frontend URL:
```javascript
const whitelist = [
  'http://localhost:5173',
  'https://your-frontend-domain.com'
];
```

### JWT Token Errors
- Check token expiration (default: 1 hour)
- Verify `JWT_SECRET` matches between .env and running server
- Ensure `Authorization: Bearer <token>` format

### File Upload Errors
- Check file size (max 5MB)
- Verify file type (jpg, jpeg, png, pdf only)
- Ensure `uploads/` directory exists and is writable

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (local|student|admin),
  phone: String,
  studentId: String,
  verificationDocument: String,
  createdAt: Date
}
```

### Issue
```javascript
{
  _id: ObjectId,
  client: ObjectId (ref: User),
  title: String,
  description: String,
  category: String,
  status: String (pending|in-progress|resolved),
  documents: [String],
  createdAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  issue: ObjectId (ref: Issue),
  sender: ObjectId (ref: User),
  content: String,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date
}
```

### QuizResult
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  quizId: String,
  quizTitle: String,
  score: Number,
  totalQuestions: Number,
  percentage: Number (auto-calculated),
  passed: Boolean (auto-calculated),
  submittedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- MongoDB for reliable database
- Cloudinary for file storage
- All contributors and testers

## 📞 Support

For support, email support@legalseva.com or create an issue in the repository.
