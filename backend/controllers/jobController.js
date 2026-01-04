import Job from "../models/Job.js";
import Company from "../models/Company.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      jobType,
      salary,
      skills,
      experience,
    } = req.body;

    const company = await Company.findOne({ employerId: req.user._id });

    if (!company) {
      return res
        .status(400)
        .json({ message: "Please create a company profile first" });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("employerId", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this job" });
    }

    if (job.status === "closed") {
      return res
        .status(400)
        .json({ message: "You cannot update a closed job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job" });
    }

    job.status = "closed";
    await job.save();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to close this job" });
    }

    if (job.status === "closed") {
      return res.status(400).json({ message: "Job is already closed" });
    }

    job.status = "closed";
    await job.save();

    res.status(200).json({ message: "Job closed successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
