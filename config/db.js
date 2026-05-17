import mongoose from "mongoose";

// Cache connection across serverless invocations
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};

export default connectDB;
