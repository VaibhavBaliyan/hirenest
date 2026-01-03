import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

applicationSchema.index({ jobId: 1 });
applicationSchema.index({ applicantId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
