# 🚀 HireNest - Job Portal Backend

A full-featured RESTful API for a job portal application built with Node.js, Express, and MongoDB.

## 📋 Features

### Authentication & Authorization

- ✅ JWT-based authentication
- ✅ Role-based access control (Employer/Job Seeker)
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware

### Job Management

- ✅ Create, read, update, delete jobs (CRUD)
- ✅ Advanced search with filters (location, job type, keywords)
- ✅ Pagination support
- ✅ Job status management (active/closed)
- ✅ Soft delete for data preservation

### Application System

- ✅ Apply to jobs with resume
- ✅ Track application status (applied/shortlisted/rejected)
- ✅ Prevent duplicate applications
- ✅ Resume snapshot for historical accuracy
- ✅ Employer can view and manage applicants

### Resume Management

- ✅ Upload PDF resumes (max 5MB)
- ✅ Multiple resume versions
- ✅ Active resume selection
- ✅ File validation and sanitization

### Saved Jobs

- ✅ Bookmark jobs for later
- ✅ View saved jobs list
- ✅ Remove bookmarks

### Security

- ✅ Rate limiting (100 req/15min general, 5 req/15min auth)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ HTTP Parameter Pollution prevention
- ✅ Request validation with express-validator

### Error Handling

- ✅ Global error handler
- ✅ Custom error classes
- ✅ Async error wrapper
- ✅ Development vs Production error modes
- ✅ Proper HTTP status codes

## �️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, hpp
- **Password Hashing:** bcryptjs

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Setup Steps

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd HireNest/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**
   Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. **Create uploads directory**

```bash
mkdir -p uploads/resumes
```

5. **Run the server**

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## � API Endpoints

### Authentication

| Method | Endpoint             | Access  | Description       |
| ------ | -------------------- | ------- | ----------------- |
| POST   | `/api/auth/register` | Public  | Register new user |
| POST   | `/api/auth/login`    | Public  | Login user        |
| GET    | `/api/auth/me`       | Private | Get current user  |

### Jobs

| Method | Endpoint              | Access   | Description                 |
| ------ | --------------------- | -------- | --------------------------- |
| POST   | `/api/jobs`           | Employer | Create new job              |
| GET    | `/api/jobs`           | Public   | Get all jobs (with filters) |
| GET    | `/api/jobs/:id`       | Public   | Get single job              |
| PUT    | `/api/jobs/:id`       | Owner    | Update job                  |
| DELETE | `/api/jobs/:id`       | Owner    | Delete job (soft)           |
| PATCH  | `/api/jobs/:id/close` | Owner    | Close job                   |

### Applications

| Method | Endpoint                                | Access     | Description               |
| ------ | --------------------------------------- | ---------- | ------------------------- |
| POST   | `/api/applications/jobs/:id/apply`      | Job Seeker | Apply to job              |
| GET    | `/api/applications/my-applications`     | Job Seeker | Get my applications       |
| GET    | `/api/applications/jobs/:id/applicants` | Job Owner  | Get job applicants        |
| PATCH  | `/api/applications/:id/status`          | Job Owner  | Update application status |

### Resumes

| Method | Endpoint                    | Access     | Description         |
| ------ | --------------------------- | ---------- | ------------------- |
| POST   | `/api/resumes/upload`       | Job Seeker | Upload resume (PDF) |
| GET    | `/api/resumes`              | Job Seeker | Get my resumes      |
| PATCH  | `/api/resumes/:id/activate` | Job Seeker | Set active resume   |

### Saved Jobs

| Method | Endpoint              | Access     | Description    |
| ------ | --------------------- | ---------- | -------------- |
| POST   | `/api/saved-jobs/:id` | Job Seeker | Save a job     |
| GET    | `/api/saved-jobs`     | Job Seeker | Get saved jobs |
| DELETE | `/api/saved-jobs/:id` | Job Seeker | Unsave job     |

## 🔍 Query Parameters

### GET /api/jobs

- `keyword` - Search in title and description
- `location` - Filter by location (case-insensitive)
- `jobType` - Filter by job type (full-time, part-time, contract, internship)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Example:**

```
GET /api/jobs?keyword=developer&location=Mumbai&jobType=full-time&page=1&limit=10
```

## � Request/Response Examples

### Register User

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "jobseeker",
  "phone": "9876543210"
}

// Response
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "jobseeker",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Job

```javascript
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Full Stack Developer",
  "description": "We are looking for an experienced developer...",
  "location": "Mumbai",
  "jobType": "full-time",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "INR"
  },
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experience": {
    "min": 3,
    "max": 5
  }
}
```

### Apply to Job

```javascript
POST /api/applications/jobs/:jobId/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I am very interested in this position..."
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get the token from login/register response and include it in subsequent requests.

## 🗂️ Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── jobController.js      # Job CRUD operations
│   ├── applicationController.js
│   ├── resumeController.js
│   └── savedJobController.js
├── middleware/
│   ├── authMiddleware.js     # JWT verification & RBAC
│   ├── errorHandler.js       # Global error handler
│   ├── upload.js             # Multer configuration
│   ├── validate.js           # Validation error handler
│   └── validators/
│       ├── authValidator.js
│       ├── jobValidator.js
│       └── applicationValidator.js
├── models/
│   ├── User.js
│   ├── Company.js
│   ├── Job.js
│   ├── Application.js
│   ├── Resume.js
│   └── SavedJob.js
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── applicationRoutes.js
│   ├── resumeRoutes.js
│   └── savedJobRoutes.js
├── utils/
│   ├── AppError.js           # Custom error class
│   ├── asyncHandler.js       # Async error wrapper
│   └── generateToken.js      # JWT token generator
├── uploads/
│   └── resumes/              # Uploaded resume files
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── server.js                 # Entry point
```

## 🧪 Testing

Test the API using:

- **Postman** - Import collection and test endpoints
- **Thunder Client** - VS Code extension
- **cURL** - Command line testing

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_random_secret>
JWT_EXPIRE=7d
FRONTEND_URL=<your_frontend_domain>
```

### Deployment Platforms

- **Heroku** - Easy deployment with Git
- **Railway** - Modern platform with free tier
- **Render** - Simple deployment
- **AWS/DigitalOcean** - Full control

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

Built as a portfolio project to demonstrate:

- RESTful API design
- MongoDB database modeling
- JWT authentication
- Security best practices
- Error handling
- Input validation
- File uploads
- Production-ready code

---

**⭐ If you found this project helpful, please give it a star!**
