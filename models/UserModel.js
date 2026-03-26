

import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hashPassword: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher"], // ← only these two can log in
    },
    contactNumber: {
      type: String,
      match: [/^\d{10}$/, "Contact number must be exactly 10 digits"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", User);
