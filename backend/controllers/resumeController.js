import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../config/cloudinary.js";
import Resume from "../models/Resume.js";

// @desc    Upload resume
// @route   POST /api/resumes/upload
// @access  Private (Job Seeker only)
export const uploadResumeFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new AppError("Please upload a PDF file", 400);
  }

  // Deactivate other resumes if this is the first one, or user can set it active later
  // For better UX, let's make the new one active by default and deactivate others
  await Resume.updateMany({ userId: req.user._id }, { isActive: false });

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    fileUrl: req.file.path, // Cloudinary URL
    fileSize: req.file.size,
    cloudinaryId: req.file.filename,
    isActive: true, // Make new resume active by default
  });

  res.status(201).json({
    message: "Resume uploaded successfully",
    resume,
  });
});

// @desc    Get user's resumes
// @route   GET /api/resumes
// @access  Private (Job Seeker only)
export const getMyResumes = asyncHandler(async (req, res, next) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort(
    "-uploadedAt"
  );
  res.json(resumes);
});

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private (Job Seeker only)
export const deleteResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  // Delete from Cloudinary
  if (resume.cloudinaryId) {
    // Determine resource_type from fileUrl (raw or image)
    const resourceType = resume.fileUrl.includes("/raw/") ? "raw" : "image";

    try {
      await cloudinary.uploader.destroy(resume.cloudinaryId, {
        resource_type: resourceType,
      });
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      // Continue to delete from DB even if Cloudinary fails
    }
  }

  // Delete from MongoDB
  await resume.deleteOne();

  res.json({ message: "Resume deleted successfully" });
});

// @desc    Set active resume
// @route   PATCH /api/resumes/:id/activate
// @access  Private (Job Seeker only)
export const setActiveResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  // Deactivate all other resumes
  await Resume.updateMany({ userId: req.user._id }, { isActive: false });

  // Activate this resume
  resume.isActive = true;
  await resume.save();

  res.json({ message: "Resume activated successfully", resume });
});
