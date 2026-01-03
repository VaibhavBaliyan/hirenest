import mongoose from "mongoose";

const { Schema } = mongoose;

const resumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1 });
resumeSchema.index({ isActive: 1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
