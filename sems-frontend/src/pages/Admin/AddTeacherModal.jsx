import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { registerUser } from "../../api/authApi";

const AddTeacherModal = ({ open, onClose }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!form.fullName || !form.email || !form.password) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      await registerUser(form);
      alert("Teacher added successfully!");
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add teacher");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between mb-4">
            <h2 className="text-3xl font-bold">Add Teacher</h2>
            <button onClick={onClose}>
              <X className="w-7 h-7" />
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 font-semibold mb-4">{errorMsg}</p>
          )}

          <Input
            label="Full Name"
            name="fullName"
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />

          <div className="mt-6">
            <Button onClick={handleSubmit}>Add Teacher</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTeacherModal;
