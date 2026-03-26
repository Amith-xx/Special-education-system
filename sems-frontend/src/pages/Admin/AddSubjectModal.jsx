import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { addSubject, updateSubject } from "../../api/subjectApi";
import { getCategories } from "../../api/categoryApi";
import { getTerms } from "../../api/termApi";
import { getTeachers } from "../../api/teacherApi";

const AddSubjectModal = ({ open, onClose, initialData = null, onSuccess }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    termId: "",
    teacherId: "",
  });

  const [categories, setCategories] = useState([]);
  const [terms, setTerms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
    getTerms().then(res => setTerms(res.data));
    getTeachers().then(res => setTeachers(res.data));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        categoryId: initialData.categoryId?._id || initialData.categoryId || "",
        termId: initialData.termId?._id || initialData.termId || "",
        teacherId: initialData.teacherId?._id || initialData.teacherId || "",
      });
    } else {
      setForm({
        name: "",
        categoryId: "",
        termId: "",
        teacherId: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.categoryId || !form.termId || !form.teacherId) {
      setError("All fields are required");
      return;
    }

    try {
      if (initialData) {
        await updateSubject(initialData._id, form);
        alert("Subject updated successfully");
      } else {
        await addSubject(form);
        alert("Subject added successfully");
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save subject");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl"
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">{initialData ? "Edit Subject" : "Add Subject"}</h2>
            <button onClick={onClose}><X /></button>
          </div>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <Input
            label="Subject Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          {/* Category */}
          <div>
            <label className="font-semibold">Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Term */}
          <div>
            <label className="font-semibold">Term</label>
            <select
              name="termId"
              value={form.termId}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Term</option>
              {terms.map(t => (
                <option key={t._id} value={t._id}>
                  {t.schemaId?.year || "Unknown Year"} ({new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div>
            <label className="font-semibold">Teacher</label>
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.fullName}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <Button onClick={handleSubmit}>{initialData ? "Update" : "Create"}</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddSubjectModal;
