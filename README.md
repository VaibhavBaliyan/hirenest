# 🚀 HireNest - Full Stack Job Portal

A modern job portal application with separate frontend and backend, featuring comprehensive job seeker and employer functionalities.

## 🏗️ Architecture

- **Frontend:** React + Redux + Vite
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT-based with role-based access control

## 📋 Features

### For Job Seekers

- ✅ Browse and search jobs with advanced filters
- ✅ Apply to jobs with resume and cover letter
- ✅ Track application status (applied/shortlisted/rejected)
- ✅ Save jobs for later viewing
- ✅ Manage multiple resume versions
- ✅ View application history

### For Employers

- ✅ Company profile management
- ✅ Post, edit, and delete job listings
- ✅ Dashboard with statistics and analytics
- ✅ View and manage applicants
- ✅ Filter applicants by status
- ✅ Bulk actions (shortlist/reject multiple applicants)
- ✅ Close/reopen job postings

### Security & Performance

- ✅ JWT authentication with secure password hashing
- ✅ Rate limiting (100 req/15min general, 5 req/15min auth)
- ✅ MongoDB injection prevention
- ✅ XSS protection and security headers
- ✅ Input validation and sanitization
- ✅ Protected routes with role-based access

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize
- **Validation:** express-validator

### Frontend

- **Library:** React 18
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Date Formatting:** date-fns

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

4. **Create uploads directory**

```bash
mkdir -p uploads/resumes
```

5. **Run the server**

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
VITE_API_URL=http://localhost:5000
```

4. **Run the development server**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs

- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Employer)
- `PUT /api/jobs/:id` - Update job (Owner)
- `DELETE /api/jobs/:id` - Delete job (Owner)
- `PATCH /api/jobs/:id/close` - Close job (Owner)
- `GET /api/jobs/my-jobs` - Get employer's jobs
- `GET /api/jobs/stats` - Get employer statistics

### Applications

- `POST /api/applications/jobs/:id/apply` - Apply to job
- `GET /api/applications/my-applications` - Get my applications
- `GET /api/applications/jobs/:id/applicants` - Get job applicants
- `PATCH /api/applications/:id/status` - Update application status

### Company

- `POST /api/companies` - Create company profile
- `GET /api/companies/mine` - Get my company
- `PUT /api/companies/mine` - Update company profile

### Saved Jobs

- `POST /api/saved-jobs/:id` - Save a job
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:id` - Unsave job

### Resumes

- `POST /api/resumes/upload` - Upload resume (PDF)
- `GET /api/resumes` - Get my resumes
- `PATCH /api/resumes/:id/activate` - Set active resume

## 🗂️ Project Structure

```
HireNest/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth, validation, error handling
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions
│   ├── uploads/             # Uploaded files
│   └── server.js            # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   │   ├── auth/        # Login, Register
    │   │   ├── jobs/        # Job cards, filters
    │   │   └── layout/      # Navbar, Footer
    │   ├── pages/           # Page components
    │   │   ├── employer/    # Employer-specific pages
    │   │   └── ...          # Job seeker pages
    │   ├── redux/           # Redux store and slices
    │   ├── utils/           # Axios config, helpers
    │   └── App.jsx          # Main app component
    └── index.html
```

## 🎨 Key Frontend Pages

### Job Seeker

- **Home** - Browse and search jobs
- **Job Details** - View job information and apply
- **My Applications** - Track application status
- **Saved Jobs** - View bookmarked jobs

### Employer

- **Dashboard** - Overview with stats and recent jobs
- **My Jobs** - Manage all job postings
- **Post Job** - Create new job listing
- **Edit Job** - Update existing job
- **View Applicants** - Review and manage applications
- **My Company** - Manage company profile

## 🚀 Deployment

### Backend (Render/Railway/Heroku)

```env
NODE_ENV=production
MONGO_URI=<mongodb_atlas_uri>
JWT_SECRET=<strong_secret>
FRONTEND_URL=<frontend_domain>
```

### Frontend (Vercel/Netlify)

```env
VITE_API_URL=<backend_api_url>
```

## 👨‍💻 Author

**Vaibhav Baliyan**

- GitHub: [@VaibhavBaliyan](https://github.com/VaibhavBaliyan)
- LinkedIn: [Vaibhav Baliyan](https://linkedin.com/in/vaibhav-baliyan-cr7)

## 📄 License

This project is licensed under the MIT License.

---

**⭐ If you found this project helpful, please give it a star!**
