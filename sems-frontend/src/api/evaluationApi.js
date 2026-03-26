import API from "./authApi";

// Get teacher classes
export const getTeacherClasses = () =>
  API.get("/api/teacher/teacher/classes");

// Get students by class
export const getStudentsByClass = (classId) =>
  API.get("/api/admin/students", {
    params: { classId },
  });

// Get subjects
export const getSubjects = () =>
  API.get("/api/admin/getSubjects");

// Get terms
export const getTerms = () =>
  API.get("/api/admin/getTerms");

// Get evaluations
export const getEvaluations = (params) =>
  API.get("/api/teacher/evaluations", { params });

// Add evaluation
export const addEvaluation = (data) =>
  API.post("/api/teacher/addEvaluation", data);


