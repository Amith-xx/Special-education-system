
import mongoose from "mongoose";


 const Student = new mongoose.Schema({
  name: String,
  dob: Date,

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  academicYearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicSchema",
    required: true
  },

  behaviour: String,
  hobby: String,
  healthIssues: String,

  emergencyContact: String,
  consultantDr: String,
  drNumber: String,

}, { timestamps: true });

export default mongoose.model("Student", Student);
