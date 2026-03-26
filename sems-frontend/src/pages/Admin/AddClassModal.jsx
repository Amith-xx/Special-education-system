import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { addClass, updateClass } from "../../api/classApi";
import { getCategories } from "../../api/categoryApi";
import { getTeachers } from "../../api/teacherApi";

const AddClassModal = ({ open, onClose, initialData = null, onSuccess }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    teacherId: "",
  });

  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        categoryId: initialData.categoryId?._id || initialData.categoryId || "",
        teacherId: initialData.teacherId?._id || initialData.teacherId || "",
      });
    } else {
      setForm({
        name: "",
        categoryId: "",
        teacherId: "",
      });
    }
  }, [initialData, open]);


  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const [catRes, teacherRes] = await Promise.all([
        getCategories(),
        getTeachers(),
      ]);
      setCategories(catRes.data);
      setTeachers(teacherRes.data);
    } catch (err) {
      console.error("Failed to load dropdown data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!form.name || !form.categoryId || !form.teacherId) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      if (initialData) {
        await updateClass(initialData._id, form);
        alert("Class updated successfully!");
      } else {
        await addClass(form);
        alert("Class added successfully!");
      }

      if (onSuccess) onSuccess();
      onClose();

    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to save class";
      setErrorMsg(msg);
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
          className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">{initialData ? "Edit Class" : "Add Class"}</h2>
            <button onClick={onClose}>
              <X className="w-7 h-7" />
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 font-semibold mb-4">
              {errorMsg}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">

            <Input
              label="Class Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={loading}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Assign Teacher
              </label>
              <select
                name="teacherId"
                value={form.teacherId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={loading}
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullName} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-6">
            <Button onClick={handleSubmit}>
              {initialData ? "Update Class" : "Create Class"}
            </Button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddClassModal;
