import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API || "http://localhost:5050",
});

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// LOGIN (Admin or Teacher)
export const loginUser = (data) => API.post("/auth/login", data);

// REGISTER TEACHER (Admin only)
export const registerUser = (data) => API.post("/auth/register", data);

// ⭐ REGISTER FIRST ADMIN (used only one time – optional for UI)
export const registerAdmin = (data) => API.post("/auth/register-admin", data);


export default API;