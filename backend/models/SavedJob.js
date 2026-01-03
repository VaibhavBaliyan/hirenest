import mongoose from "mongoose";

const { Schema } = mongoose;

const savedJobSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
savedJobSchema.index({ userId: 1 });
savedJobSchema.index({ jobId: 1 });

const SavedJob = mongoose.model("SavedJob", savedJobSchema);
export default SavedJob;
