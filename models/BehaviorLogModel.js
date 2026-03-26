// models/BehaviorLogModel.js
import mongoose from "mongoose";

const BehaviorLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    mood: {
      type: String,
      enum: ["happy", "neutral", "sad"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BehaviorLog", BehaviorLogSchema);
