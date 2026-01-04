import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const applyToJob = asyncHandler(async (req, res, next) => {
  const { coverLetter } = req.body;
  const jobId = req.params.id;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.status === "closed") {
    throw new AppError("Cannot apply to a closed job", 400);
  }

  if (job.employerId.toString() === req.user._id.toString()) {
    throw new AppError("Cannot apply to your own job", 400);
  }

  const activeResume = await Resume.findOne({
    userId: req.user._id,
    isActive: true,
  });

  if (!activeResume) {
    throw new AppError("Please upload a resume before applying", 400);
  }

  const existingApplication = await Application.findOne({
    jobId,
    applicantId: req.user._id,
  });

  if (existingApplication) {
    throw new AppError("You have already applied to this job", 400);
  }

  const application = await Application.create({
    jobId,
    applicantId: req.user._id,
    coverLetter,
    resumeUrl: activeResume.fileUrl,
  });

  res
    .status(201)
    .json({ message: "Application submitted successfully", application });
});

export const getMyApplications = asyncHandler(async (req, res, next) => {
  const applications = await Application.find({ applicantId: req.user._id })
    .populate("jobId", "title location jobType salary status")
    .sort("-appliedAt");

  res.json(applications);
});

export const getJobApplicants = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to view applicants", 403);
  }

  const applications = await Application.find({ jobId: job._id })
    .populate("applicantId", "name email phone")
    .sort("-appliedAt");

  res.json(applications);
});

export const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!["applied", "shortlisted", "rejected"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const application = await Application.findById(req.params.id).populate(
    "jobId"
  );

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.jobId.employerId.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this application", 403);
  }

  application.status = status;
  await application.save();

  res.json({
    message: "Application status updated successfully",
    application,
  });
});
