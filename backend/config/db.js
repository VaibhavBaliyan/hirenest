import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  // In test environment, skip connection (test setup handles it)
  if (process.env.NODE_ENV === "test") {
    console.log("⏭  Skipping DB connection in test mode");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
