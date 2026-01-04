import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
} from "../controllers/jobController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  validateCreateJob,
  validateUpdateJob,
} from "../middleware/validators/jobValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

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
