import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = asyncHandler(async (req, res, next) => {
  const { title, description, location, jobType, salary, skills, experience } =
    req.body;

  const company = await Company.findOne({ employerId: req.user._id });

  if (!company) {
    throw new AppError("Please create a company profile first", 400);
  }

  const job = await Job.create({
    title,
    description,
    company: company._id,
    employerId: req.user._id,
    location,
    jobType,
    salary,
    skills,
    experience,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs with filters and pagination
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = asyncHandler(async (req, res, next) => {
  const { keyword, location, jobType, page = 1, limit = 20 } = req.query;

  const query = { status: "active" };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }
  if (jobType) {
    query.jobType = jobType;
  }

  const skip = (page - 1) * limit;

  const jobs = await Job.find(query)
    .populate("company", "companyName logo location")
    .populate("employerId", "name email")
    .limit(parseInt(limit))
    .skip(skip)
    .sort("-createdAt");

  const total = await Job.countDocuments(query);

  res.json({
    jobs,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalJobs: total,
  });
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate("company")
    .populate("employerId", "name email");

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  res.json(job);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
export const updateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this job", 403);
  }

  if (job.status === "closed") {
    throw new AppError("Cannot update a closed job", 400);
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updatedJob);
});

// @desc    Delete a job (soft delete)
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
export const deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to delete this job", 403);
  }

  job.status = "closed";
  await job.save();

  res.json({ message: "Job deleted successfully" });
});

// @desc    Close a job
// @route   PATCH /api/jobs/:id/close
// @access  Private (Job owner only)
export const closeJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to close this job", 403);
  }

  if (job.status === "closed") {
    throw new AppError("Job is already closed", 400);
  }

  job.status = "closed";
  await job.save();

  res.json({ message: "Job closed successfully", job });
});

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
export const getMyJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.aggregate([
    {
      $match: {
        employerId: req.user._id,
      },
    },
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "jobId",
        as: "applications",
      },
    },
    {
      $addFields: {
        applicationCount: { $size: "$applications" },
      },
    },
    {
      $project: {
        applications: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  await Job.populate(jobs, {
    path: "company",
    select: "companyName logo location",
  });

  res.json(jobs);
});

// @desc    Get employer stats
// @route   GET /api/jobs/stats
// @access  Private (Employer only)
export const getEmployerStats = asyncHandler(async (req, res, next) => {
  const totalJobs = await Job.countDocuments({ employerId: req.user._id });
  const activeJobs = await Job.countDocuments({
    employerId: req.user._id,
    status: "active",
  });

  // Get all job IDs for this employer
  const jobs = await Job.find({ employerId: req.user._id }).select("_id");
  const jobIds = jobs.map((job) => job._id);

  // Count applications for these jobs
  const totalApplications = await Application.countDocuments({
    jobId: { $in: jobIds },
  });

  const pendingApplications = await Application.countDocuments({
    jobId: { $in: jobIds },
    status: "applied",
  });

  res.json({
    totalJobs,
    activeJobs,
    totalApplications,
    pendingApplications,
  });
});
