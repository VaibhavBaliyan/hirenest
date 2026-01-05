import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Save a job
// @route   POST /api/saved-jobs/:id
// @access  Private (Job seeker only)
export const saveJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existingSave = await SavedJob.findOne({
    jobId,
    userId: req.user._id,
  });

  if (existingSave) {
    throw new AppError("Job already saved", 400);
  }

  const savedJob = await SavedJob.create({ jobId, userId: req.user._id });
  await savedJob.populate("jobId");

  res.status(201).json(savedJob);
});

// @desc    Get all saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Job seeker only)
export const getSavedJobs = asyncHandler(async (req, res, next) => {
  const savedJobs = await SavedJob.find({ userId: req.user._id })
    .populate("jobId")
    .sort("-savedAt");

  res.json(savedJobs);
});

// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:id
// @access  Private (Job seeker only)
export const unsaveJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.id;

  const savedJob = await SavedJob.findOne({
    jobId,
    userId: req.user._id,
  });

  if (!savedJob) {
    throw new AppError("Saved job not found", 404);
  }

  await savedJob.deleteOne();

  res.json({ message: "Job unsaved successfully" });
});
