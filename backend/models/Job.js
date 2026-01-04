import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "internship", "contract"],
    },
    salary: {
      min: { type: Number, min: 0 },
      max: {
        type: Number,
        validate: {
          validator: function (value) {
            if (this.min && value) {
              return value >= this.min;
            }
            return true;
          },
          message:
            "Maximum salary must be greater than or equal to minimum salary",
        },
      },
      currency: { type: String, default: "INR" },
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      min: { type: Number, min: 0 },
      max: {
        type: Number,
        validate: {
          validator: function (value) {
            if (this.min && value) {
              return value >= this.min;
            }
            return true;
          },
          message:
            "Maximum experience must be greater than or equal to minimum experience",
        },
      },
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

jobSchema.index({ employerId: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ location: 1 });

jobSchema.index({ title: "text", description: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;
