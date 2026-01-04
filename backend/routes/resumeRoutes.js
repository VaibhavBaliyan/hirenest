import express from "express";
import {
  uploadResume,
  getResume,
  setActiveResume,
} from "../controllers/resumeController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes are for job seekers only
router.post(
  "/upload",
  protect,
  restrictTo("jobseeker"),
  upload.single("resume"),
  uploadResume
);
router.get("/", protect, restrictTo("jobseeker"), getResume);
router.patch(
  "/:id/activate",
  protect,
  restrictTo("jobseeker"),
  setActiveResume
);

export default router;
