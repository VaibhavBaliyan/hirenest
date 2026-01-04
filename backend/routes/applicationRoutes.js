import express from "express";
import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Job seeker routes
router.post("/jobs/:id/apply", protect, restrictTo("jobseeker"), applyToJob);
router.get(
  "/my-applications",
  protect,
  restrictTo("jobseeker"),
  getMyApplications
);

// Employer routes
router.get(
  "/jobs/:id/applicants",
  protect,
  restrictTo("employer"),
  getJobApplicants
);
router.patch(
  "/:id/status",
  protect,
  restrictTo("employer"),
  updateApplicationStatus
);

export default router;
