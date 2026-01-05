import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/upload.js";
import {
  uploadResumeFile,
  getMyResumes,
  deleteResume,
  setActiveResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// All routes require authentication and job seeker role
router.use(protect);
router.use(restrictTo("jobseeker"));

// Upload resume
router.post("/upload", uploadResume.single("resume"), uploadResumeFile);

// Get my resumes
router.get("/", getMyResumes);

// Delete resume
router.delete("/:id", deleteResume);

// Set active resume
router.patch("/:id/activate", setActiveResume);

export default router;
