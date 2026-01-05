import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
  getMyJobs,
  getEmployerStats,
} from "../controllers/jobController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  validateCreateJob,
  validateUpdateJob,
} from "../middleware/validators/jobValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// Employer routes (must be before /:id)
router.get("/my-jobs", protect, restrictTo("employer"), getMyJobs);
router.get("/stats", protect, restrictTo("employer"), getEmployerStats);

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected routes - Employers only
router.post(
  "/",
  protect,
  restrictTo("employer"),
  validateCreateJob,
  validate,
  createJob
);
router.put(
  "/:id",
  protect,
  restrictTo("employer"),
  validateUpdateJob,
  validate,
  updateJob
);
router.delete("/:id", protect, restrictTo("employer"), deleteJob);
router.patch("/:id/close", protect, restrictTo("employer"), closeJob);

export default router;
