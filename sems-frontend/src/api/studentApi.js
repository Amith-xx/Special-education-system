import API from "./authApi";  // reuse same axios instance

export const addStudent = (data) =>
  API.post("/api/teacher/students/add", data);


export const getStudents = (params) =>
  API.get("/api/admin/students", { params });

export const getStudentDetails = (studentId) =>
  API.get(`/api/admin/students/${studentId}/details`);

export const deleteStudent = (studentId) =>
  API.delete(`/api/admin/deleteStudent/${studentId}`);

export const updateStudent = (studentId, data) =>
  API.put(`/api/admin/updateStudent/${studentId}`, data);
