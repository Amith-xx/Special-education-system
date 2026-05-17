import mongoose from "mongoose";
const updateSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  updateMessage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Update", updateSchema);
