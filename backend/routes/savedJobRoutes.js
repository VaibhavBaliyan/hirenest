import express from "express";
import {
  saveJob,
  getSavedJobs,
  unsaveJob,
} from "../controllers/savedJobController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are for job seekers only
router.post("/:id", protect, restrictTo("jobseeker"), saveJob);
router.get("/", protect, restrictTo("jobseeker"), getSavedJobs);
router.delete("/:id", protect, restrictTo("jobseeker"), unsaveJob);

export default router;
