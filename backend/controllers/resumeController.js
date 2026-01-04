import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume" });
    }

    await Resume.updateMany({ userId: req.user._id }, { isActive: false });

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileSize: req.file.size,
      isActive: true,
    });

    res.status(200).json({ message: "Resume uploaded successfully", resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort(
      "-uploadedAt"
    );
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this resume" });
    }

    await Resume.updateMany({ userId: req.user._id }, { isActive: false });

    resume.isActive = true;
    await resume.save();

    res.status(200).json({ message: "Resume updated successfully", resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
