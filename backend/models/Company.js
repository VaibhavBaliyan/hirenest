import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    website: {
      type: String,
      match: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    },
    logo: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

companySchema.index({ employerId: 1, companyName: 1 }, { unique: true });
//this will allow same company name with different employers but not same company name with same employer

const Company = mongoose.model("Company", companySchema);
export default Company;
