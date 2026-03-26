import API from './authApi';

export const addTerm = (data) =>
  API.post('/api/admin/addTerm', data);

export const getTerms = () =>
  API.get("/api/admin/getTerms");

export const deleteTerm = (id) => API.delete(`/api/admin/deleteTerm/${id}`);

export const updateTerm = (id, data) => API.put(`/api/admin/updateTerm/${id}`, data);