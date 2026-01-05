import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Cloudinary storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hirenest/resumes",
    allowed_formats: ["pdf"],
    resource_type: "auto", // Allow Cloudinary to detect file type (enables PDF viewing)
    access_mode: "public", // Force public access
    format: "pdf", // Ensure it's saved as PDF
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `resume-${req.user._id}-${uniqueSuffix}`;
    },
  },
});

// Cloudinary storage for company logos
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hirenest/logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `logo-${req.user._id}-${uniqueSuffix}`;
    },
  },
});

// File filter for resumes (PDF only)
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for resumes"), false);
  }
};

// File filter for logos (images only)
const logoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for logos"), false);
  }
};

// Multer upload middleware for resumes
export const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: resumeFileFilter,
});

// Multer upload middleware for logos
export const uploadLogo = multer({
  storage: logoStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: logoFileFilter,
});
