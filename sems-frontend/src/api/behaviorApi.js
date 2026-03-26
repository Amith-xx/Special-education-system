import API from "./authApi";

export const getBehaviorLogs = (params) =>
  API.get("/api/behavior", { params });

export const addBehaviorLog = (data) =>
  API.post("/api/behavior/add", data);
