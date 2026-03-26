import mongoose from "mongoose";

const academicSchema = new mongoose.Schema(
   {
    year: { type: String, required: true }
  },
  { timestamps: true } 
);

export default mongoose.model("AcademicSchema", academicSchema);
