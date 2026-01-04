import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";

export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingSave = await SavedJob.findOne({
      jobId,
      userId: req.user._id,
    });

    if (existingSave) {
      return res
        .status(400)
        .json({ message: "You have already saved this job" });
    }

    const savedJob = await SavedJob.create({ jobId, userId: req.user._id });

    res.status(201).json({ message: "Job saved successfully", savedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.user._id })
      .populate("jobId")
      .sort("-savedAt");

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);

    if (!savedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (savedJob.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to unsave this job" });
    }

    await savedJob.deleteOne();

    res.status(200).json({ message: "Job unsaved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
