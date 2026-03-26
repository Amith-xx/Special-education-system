import API from "./authApi";  // reuse same axios instance

export const addSubject = (data) =>
   API.post("/api/admin/addSubject", data);

export const getSubjects = () => API.get("/api/admin/subjects");

export const deleteSubject = (id) => API.delete(`/api/admin/deleteSubject/${id}`);

export const updateSubject = (id, data) => API.put(`/api/admin/updateSubject/${id}`, data);


