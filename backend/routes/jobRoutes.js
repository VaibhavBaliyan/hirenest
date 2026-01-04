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

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected routes - Employers only
router.post("/", protect, restrictTo("employer"), createJob);
router.put("/:id", protect, restrictTo("employer"), updateJob);
router.delete("/:id", protect, restrictTo("employer"), deleteJob);
router.patch("/:id/close", protect, restrictTo("employer"), closeJob);

export default router;
