import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("Please upload a resume", 400);
  }

  await Resume.updateMany({ userId: req.user._id }, { isActive: false });

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    fileUrl: req.file.path,
    fileSize: req.file.size,
    isActive: true,
  });

  res.status(201).json({ message: "Resume uploaded successfully", resume });
});

export const getResume = asyncHandler(async (req, res, next) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort(
    "-uploadedAt"
  );
  res.json(resumes);
});

export const setActiveResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  if (resume.userId.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this resume", 403);
  }

  await Resume.updateMany({ userId: req.user._id }, { isActive: false });

  resume.isActive = true;
  await resume.save();

  res.json({ message: "Resume activated successfully", resume });
});
