import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

export const applyToJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status === "closed") {
      return res
        .status(400)
        .json({ message: "You cannot apply to a closed job" });
    }

    if (job.employerId.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot apply to your own job" });
    }

    const activeResume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (!activeResume) {
      return res
        .status(400)
        .json({ message: "Please upload a resume before applying" });
    }

    const existingApplication = await Application.findOne({
      jobId,
      applicantId: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate("jobId", "title location jobType salary status")
      .sort("-appliedAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this job applicants",
      });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate("applicantId", "name email phone")
      .sort("-appliedAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["applied", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate(
      "jobId"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
