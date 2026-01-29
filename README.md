# 🚀 HireNest - Full Stack Job Portal

<div align="center">

![HireNest Logo](https://img.shields.io/badge/HireNest-Job%20Portal-blue?style=for-the-badge&logo=briefcase)

**Modern job portal connecting talented professionals with top employers**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://hirenest-ten.vercel.app)
[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Backend](https://img.shields.io/badge/backend-Node.js-green?style=for-the-badge&logo=node.js)](https://hirenest-backend-pazn.onrender.com)
[![Frontend](https://img.shields.io/badge/frontend-React-61DAFB?style=for-the-badge&logo=react)](https://hirenest-ten.vercel.app)

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express. js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=flat&logo=redux&logoColor=white)](Red https://redux.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

[Live Demo](https://hirenest-ten.vercel.app) · [Report Bug](https://github.com/VaibhavBaliyan/hirenest/issues) · [Request Feature](https://github.com/VaibhavBaliyan/hirenest/issues)

</div>

---

## 📸 Live Demo

**🔗 Application URL:** [https://hirenest-ten.vercel.app](https://hirenest-ten.vercel.app)

### Demo Credentials

```javascript
// Job Seeker Account
Email: jobseeker@demo.com
Password: Demo@123

// Employer Account
Email: employer@demo.com
Password: Demo@123
```

### Key Features in Action

- 🔍 **Smart Job Search** - Filter by location, type, and keywords
- 💼 **Dual User Roles** - Separate dashboards for job seekers and employers
- 📄 **Resume Management** - Upload, manage, and set active resumes (Cloudinary integration)
- 📊 **Analytics Dashboard** - Real-time statistics for employers
- ⚡ **Quick Apply** - One-click applications with saved resume
- 🔖 **Save Jobs** - Bookmark interesting positions for later

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - React SPA"
        A[React 18 + Vite]
        B[Redux Toolkit]
        C[React Router v6]
        D[Tailwind CSS]
    end

    subgraph "Backend - Node.js API"
        E[Express.js]
        F[JWT Auth]
        G[Multer + Cloudinary]
        H[Rate Limiter]
    end

    subgraph "Database"
        I[(MongoDB Atlas)]
    end

    subgraph "External Services"
        J[Cloudinary CDN]
    end

    A --> E
    B --> E
    E --> F
    E --> G
    E --> H
    E --> I
    G --> J

    style A fill:#61DAFB
    style E fill:#68A063
    style I fill:#4DB33D
    style J fill:#3448C5
```

### System Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant C as Cloudinary

    U->>F: Login
    F->>B: POST /api/auth/login
    B->>DB: Verify credentials
    DB-->>B: User data
    B-->>F: JWT Token
    F->>F: Store token in Redux

    U->>F: Upload Resume
    F->>B: POST /api/resumes/upload (multipart)
    B->>C: Upload PDF
    C-->>B: File URL + ID
    B->>DB: Save metadata
    DB-->>B: Resume document
    B-->>F: Success + Resume data

    U->>F: Apply for Job
    F->>B: POST /api/applications/jobs/:id/apply
    B->>DB: Create application
    B->>DB: Prevent duplicates
    DB-->>B: Application created
    B-->>F: Success message
```

---

## 📋 Features

### 👤 For Job Seekers

| Feature                     | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| 🔍 **Advanced Search**      | Filter jobs by location, type, salary, and keywords with pagination  |
| 📝 **Quick Apply**          | One-click applications using active resume with cover letter support |
| 📊 **Application Tracking** | Monitor status changes (Applied → Shortlisted → Rejected)            |
| 🔖 **Save Jobs**            | Bookmark interesting roles for later review                          |
| 📄 **Resume Manager**       | Upload multiple PDF resumes (5MB max), set active resume             |
| 📧 **Email Notifications**  | Get notified about application status updates (future)               |

### 🏢 For Employers

| Feature                     | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| 🎯 **Company Profile**      | Create detailed company profiles with logo and social links    |
| 📝 **Job Management**       | Post, edit, delete, and close job listings with rich details   |
| 📊 **Analytics Dashboard**  | Real-time stats (total jobs, applications, active/closed jobs) |
| 👥 **Applicant Management** | View, filter, and manage candidates by status                  |
| ⚡ **Bulk Actions**         | Shortlist or reject multiple applicants at once                |
| 🔄 **Job Lifecycle**        | Close/reopen positions to control visibility                   |

### 🔐 Security & Performance

- ✅ **JWT Authentication** - Secure token-based auth with bcrypt password hashing
- ✅ **Role-Based Access Control** - Separate permissions for job seekers and employers
- ✅ **Rate Limiting** - 100 requests/15min (general), 5 requests/15min (auth endpoints)
- ✅ **Input Validation** - express-validator for all incoming data
- ✅ **MongoDB Injection Prevention** - express-mongo-sanitize middleware
- ✅ **XSS Protection** - Helmet.js security headers and HPP protection
- ✅ **CORS Configuration** - Whitelist frontend origin
- ✅ **File Upload Security** - PDF validation, size limits (5MB), virus scanning ready

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

- **⚛️ React 18** - UI library with hooks
- **🗂️ Redux Toolkit** - State management
- **🚦 React Router v6** - Client-side routing
- **⚡ Vite** - Build tool (faster than CRA)
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📡 Axios** - HTTP client with interceptors
- **🔔 React Hot Toast** - Notifications
- **📅 date-fns** - Date formatting

</td>
<td valign="top" width="50%">

### Backend

- **🟢 Node.js** - Runtime environment
- **⚙️ Express.js** - Web framework
- **🍃 MongoDB** - NoSQL database
- **🔐 JWT** - Authentication tokens
- **☁️ Cloudinary** - File storage (PDFs)
- **🛡️ Helmet** - Security headers
- **🚧 express-rate-limit** - DDoS protection
- **✅ express-validator** - Input validation

</td>
</tr>
</table>

---

## 📦 Installation & Setup

### Prerequisites

```bash
Node.js >= 14.x
MongoDB Atlas account (or local MongoDB)
Cloudinary account (for file uploads)
npm or yarn
```

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/VaibhavBaliyan/hirenest.git
cd hirenest/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hirenest
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run development server**

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
VITE_API_URL=http://localhost:5000
```

4. **Run development server**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🌐 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://hirenest-backend-pazn.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint         | Access  | Description                                |
| ------ | ---------------- | ------- | ------------------------------------------ |
| `POST` | `/auth/register` | Public  | Register new user (job seeker or employer) |
| `POST` | `/auth/login`    | Public  | Login and receive JWT token                |
| `GET`  | `/auth/me`       | Private | Get current authenticated user             |

#### Example: Register User

**Request:**

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "jobseeker",
  "phone": "9876543210"
}
```

**Response (201 Created):**

```json
{
  "_id": "65a1b2c3d4e5f6789",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "jobseeker",
  "phone": "9876543210",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Example: Login

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "_id": "65a1b2c3d4e5f6789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Job Endpoints

| Method   | Endpoint          | Access   | Description                                  |
| -------- | ----------------- | -------- | -------------------------------------------- |
| `GET`    | `/jobs`           | Public   | Get all jobs (supports filters & pagination) |
| `GET`    | `/jobs/:id`       | Public   | Get single job details                       |
| `POST`   | `/jobs`           | Employer | Create new job posting                       |
| `PUT`    | `/jobs/:id`       | Owner    | Update job details                           |
| `DELETE` | `/jobs/:id`       | Owner    | Delete job (soft delete)                     |
| `PATCH`  | `/jobs/:id/close` | Owner    | Close/reopen job                             |
| `GET`    | `/jobs/my-jobs`   | Employer | Get employer's posted jobs                   |
| `GET`    | `/jobs/stats`     | Employer | Get employer statistics                      |

#### Example: Get All Jobs (with filters)

**Request:**

```http
GET /api/jobs?keyword=developer&location=Mumbai&jobType=full-time&page=1&limit=10
```

**Response (200 OK):**

```json
{
  "jobs": [
    {
      "_id": "65a1b2c3d4e5f6789",
      "title": "Senior Full Stack Developer",
      "description": "We are looking for an experienced developer...",
      "company": {
        "_id": "65a1b2c3d4e5f6123",
        "name": "Tech Corp",
        "logo": "https://res.cloudinary.com/..."
      },
      "location": "Mumbai, Maharashtra",
      "jobType": "full-time",
      "salary": {
        "min": 800000,
        "max": 1200000,
        "currency": "INR"
      },
      "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
      "experience": { "min": 3, "max": 5 },
      "openings": 2,
      "isActive": true,
      "postedBy": "65a1b2c3d4e5f6456",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

---

### Application Endpoints

| Method  | Endpoint                            | Access     | Description               |
| ------- | ----------------------------------- | ---------- | ------------------------- |
| `POST`  | `/applications/jobs/:id/apply`      | Job Seeker | Apply to a job            |
| `GET`   | `/applications/my-applications`     | Job Seeker | Get user's applications   |
| `GET`   | `/applications/jobs/:id/applicants` | Job Owner  | Get job applicants        |
| `PATCH` | `/applications/:id/status`          | Job Owner  | Update application status |

#### Example: Apply for Job

**Request:**

```http
POST /api/applications/jobs/65a1b2c3d4e5f6789/apply
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "coverLetter": "I am very interested in this position because..."
}
```

**Response (201 Created):**

```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "65a1b2c3d4e5f6999",
    "job": "65a1b2c3d4e5f6789",
    "applicant": "65a1b2c3d4e5f6111",
    "resume": {
      "fileName": "Resume_2024.pdf",
      "fileUrl": "https://res.cloudinary.com/...",
      "fileSize": 245678
    },
    "coverLetter": "I am very interested in this position because...",
    "status": "applied",
    "appliedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Resume Endpoints

| Method   | Endpoint                | Access     | Description                        |
| -------- | ----------------------- | ---------- | ---------------------------------- |
| `POST`   | `/resumes/upload`       | Job Seeker | Upload PDF resume (max 5MB)        |
| `GET`    | `/resumes`              | Job Seeker | Get user's resumes                 |
| `DELETE` | `/resumes/:id`          | Job Seeker | Delete resume (Cloudinary + DB)    |
| `PATCH`  | `/resumes/:id/activate` | Job Seeker | Set active resume for applications |

#### Example: Upload Resume

**Request:**

```http
POST /api/resumes/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

resume: [PDF File]
```

**Response (201 Created):**

```json
{
  "message": "Resume uploaded successfully",
  "resume": {
    "_id": "65a1b2c3d4e5f6888",
    "userId": "65a1b2c3d4e5f6111",
    "fileName": "Resume_2024.pdf",
    "fileUrl": "https://res.cloudinary.com/demo/image/upload/v1/hirenest/resumes/resume-65a1b2c3-1705315200000-562440888.pdf",
    "fileSize": 245678,
    "cloudinaryId": "hirenest/resumes/resume-65a1b2c3-1705315200000-562440888",
    "isActive": true,
    "uploadedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Company Endpoints

| Method | Endpoint          | Access   | Description            |
| ------ | ----------------- | -------- | ---------------------- |
| `POST` | `/companies`      | Employer | Create company profile |
| `GET`  | `/companies/mine` | Employer | Get employer's company |
| `PUT`  | `/companies/mine` | Employer | Update company profile |

---

### Saved Jobs Endpoints

| Method   | Endpoint          | Access     | Description         |
| -------- | ----------------- | ---------- | ------------------- |
| `POST`   | `/saved-jobs/:id` | Job Seeker | Save/bookmark a job |
| `GET`    | `/saved-jobs`     | Job Seeker | Get all saved jobs  |
| `DELETE` | `/saved-jobs/:id` | Job Seeker | Remove saved job    |

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Verify user & password
    Database-->>Backend: User found
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: Return user + token
    Frontend->>Frontend: Store in Redux + localStorage

    Note over Frontend,Backend: All subsequent requests include JWT

    Frontend->>Backend: GET /api/jobs/my-jobs<br/>(Authorization: Bearer TOKEN)
    Backend->>Backend: Verify JWT signature
    Backend->>Backend: Check token expiry
    Backend->>Backend: Extract user ID & role
    Backend->>Database: Fetch user's jobs
    Database-->>Backend: Jobs data
    Backend-->>Frontend: Return authorized data

    Note over User,Database: Token expires after 7 days

    User->>Frontend: Click Logout
    Frontend->>Frontend: Clear Redux store
    Frontend->>Frontend: Remove localStorage token
    Frontend-->>User: Redirect to login
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "65a1b2c3d4e5f6789",
    "role": "jobseeker",
    "iat": 1705315200,
    "exp": 1705920000
  },
  "signature": "HMACSHA256(base64(header) + '.' + base64(payload), JWT_SECRET)"
}
```

---

## 📁 Project Structure

```
HireNest/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── jobController.js      # Job CRUD + search
│   │   ├── applicationController.js
│   │   ├── resumeController.js   # File upload handling
│   │   ├── companyController.js
│   │   └── savedJobController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification + RBAC
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── upload.js             # Multer + Cloudinary config
│   │   └── validators/           # express-validator schemas
│   ├── models/
│   │   ├── User.js               # User schema (job seeker + employer)
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Resume.js
│   │   └── SavedJob.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── companyRoutes.js
│   │   └── savedJobRoutes.js
│   ├── utils/
│   │   ├── AppError.js           # Custom error class
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   └── generateToken.js      # JWT token generator
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── jobs/
    │   │   │   ├── JobCard.jsx
    │   │   │   └── JobFilters.jsx
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── JobDetails.jsx
    │   │   ├── MyApplications.jsx
    │   │   ├── SavedJobs.jsx
    │   │   ├── Profile.jsx
    │   │   └── employer/
    │   │       ├── Dashboard.jsx
    │   │       ├── CreateJob.jsx
    │   │       ├── EditJob.jsx
    │   │       ├── MyJobs.jsx
    │   │       ├── ViewApplicants.jsx
    │   │       ├── CreateCompany.jsx
    │   │       └── CompanyProfile.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── jobSlice.js
    │   │       ├── applicationSlice.js
    │   │       ├── savedJobSlice.js
    │   │       ├── employerSlice.js
    │   │       └── companySlice.js
    │   ├── utils/
    │   │   └── axios.js          # Axios config + interceptors
    │   ├── hooks/
    │   │   └── useAuth.js        # Custom auth hook
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── index.html
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Deployment

### Backend (Render)

1. Create new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`
6. Deploy!

### Frontend (Vercel)

1. Import project on [Vercel](https://vercel.com)
2. Framework Preset: **Vite**
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variable: `VITE_API_URL=your_backend_url`
7. Deploy!

---

## 🧪 Testing

### Manual API Testing

Use the provided cURL commands or import into Postman:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get Jobs
curl -X GET http://localhost:5000/api/jobs?keyword=developer&page=1&limit=10

# Apply for Job (with JWT)
curl -X POST http://localhost:5000/api/applications/jobs/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"coverLetter":"I am interested..."}'
```

---

## 📈 Future Enhancements

- [ ] Email notifications for application updates
- [ ] Real-time chat between employers and candidates
- [ ] Advanced search with AI-based job recommendations
- [ ] Video interview scheduling
- [ ] Skill assessment tests
- [ ] Company reviews and ratings
- [ ] Mobile app (React Native)
- [ ] LinkedIn integration for profile import
- [ ] Referral system
- [ ] Salary insights and trends

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vaibhav Baliyan**

- GitHub: [@VaibhavBaliyan](https://github.com/VaibhavBaliyan)
- LinkedIn: [Vaibhav Baliyan](https://linkedin.com/in/vaibhav-baliyan-cr7)
- Portfolio: [vaibhavbaliyan.tech](https://vaibhavbaliyan.tech)

---

## 🙏 Acknowledgments

- Built as a full-stack portfolio project to demonstrate MERN stack proficiency
- Designed with modern best practices and industry standards
- Focused on security, scalability, and user experience

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Vaibhav Baliyan

</div>
