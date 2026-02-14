import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import BehaviorPage from "./pages/Behavior/BehaviorPage";
import TherapyPage from "./pages/Therapy/TherapyPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";


import GamesPortal from "./pages/Games/GamePortal";
import EvaluationHome from "./pages/Evaluation/EvaluationHome";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN FIRST */}
        <Route path="/" element={<LoginPage />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* DASHBOARDS */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
        {/* OTHER FEATURES */}
        <Route path="/behavior" element={<BehaviorPage />} />
        <Route path="/therapy" element={<TherapyPage />} />

        <Route path="/games" element={<GamesPortal hideSidebar={true}/>} />
        <Route path="/evaluation" element={<EvaluationHome />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
