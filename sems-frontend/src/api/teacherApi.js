import API from "./authApi";

export const getTeachers = () =>
  API.get("/api/admin/getTeachers");



/* ===========================
   STUDENTS
=========================== */

export const addStudent = (data) =>
  API.post("/api/teacher/students/add", data);

export const updateStudent = (id, data) =>
  API.put(`/api/teacher/students/${id}`, data);


/* ===========================
   EVALUATIONS
=========================== */

export const addEvaluation = (data) =>
  API.post("/api/teacher/addEvaluation", data);

export const getEvaluations = (params) =>
  API.get("/api/teacher/evaluations", { params });


/* ===========================
   CLASSES (teacher only)
=========================== */

export const getTeacherClasses = () =>
  API.get("/api/teacher/classes");
