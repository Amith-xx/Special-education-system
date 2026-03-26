import React, { useState } from "react";
import { loginUser } from "../../api/authApi";
import { motion } from "framer-motion";
import Input from "../../components/UI/Input";
import { useNavigate } from "react-router-dom";

import Button from "../../components/UI/Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const { data } = await loginUser({ email, password });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("fullName", data.fullName);

    if (data.role === "admin") {
      navigate("/admin/dashboard");
    } else if (data.role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      alert("Access denied");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};



  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md"
      >
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6"
>
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-center font-semibold mb-4">
            {error}
          </p>
        )}

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button onClick={handleLogin}>Login</Button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">Register</a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
