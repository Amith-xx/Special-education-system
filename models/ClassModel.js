import mongoose from "mongoose";
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  //academicYearId: {
   // type: mongoose.Schema.Types.ObjectId,
    //ref: "AcademicSchema",
    //required: true,
 // }
});

export default mongoose.model("Class", classSchema);
