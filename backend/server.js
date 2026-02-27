import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

connectDB();

const app = express();

// Security Middleware
// Set security HTTP headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased limit for development/testing
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});
app.use("/api", limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Increased limit for auth attempts
  message: "Too many authentication attempts, please try again later",
  skipSuccessfulRequests: true,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Body parser
app.use(express.json({ limit: "10kb" })); // Limit body size

// Data sanitization against NoSQL query injection
app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["skills", "location", "jobType"], // Allow these params to appear multiple times
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/companies", companyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "HireNest API is running..." });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    ),
  );
}

// Export app for testing
export default app;
