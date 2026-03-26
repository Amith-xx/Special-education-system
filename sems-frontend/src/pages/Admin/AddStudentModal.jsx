
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Button from "../../components/UI/Button";

import { addStudent, updateStudent } from "../../api/studentApi";
import { getCategories } from "../../api/categoryApi";
import { getAcademicYears } from "../../api/academicApi";
import { getAllClasses } from "../../api/classApi";

const AddStudentModal = ({ open, onClose, initialData = null, onSuccess }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    name: "",
    dob: "",
    categoryId: "",
    academicYearId: "",
    classId: "",
    behaviour: "",
    hobby: "",
    healthIssues: "",
    emergencyContact: "",
    consultantDr: "",
    drNumber: "",
  });

  const [categories, setCategories] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Load dropdown data
  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
    getAcademicYears().then(res => setAcademicYears(res.data.years));
    getAllClasses().then(res => setClasses(res.data));
  }, []);

  // 🔹 Populate form if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
        categoryId: initialData.categoryId?._id || initialData.categoryId || "",
        academicYearId: initialData.academicYearId?._id || initialData.academicYearId || "",
        classId: initialData.classId?._id || initialData.classId || "",
        behaviour: initialData.behaviour || "",
        hobby: initialData.hobby || "",
        healthIssues: initialData.healthIssues || "",
        emergencyContact: initialData.emergencyContact || "",
        consultantDr: initialData.consultantDr || "",
        drNumber: initialData.drNumber || "",
      });
    } else {
      // Reset form if adding new
      setForm({
        name: "",
        dob: "",
        categoryId: "",
        academicYearId: "",
        classId: "",
        behaviour: "",
        hobby: "",
        healthIssues: "",
        emergencyContact: "",
        consultantDr: "",
        drNumber: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setErrorMsg("");

    if (
      !form.name ||
      !form.categoryId ||
      !form.academicYearId ||
      !form.classId
    ) {
      setErrorMsg("Name, Category, Academic Year and Class are required");
      return;
    }

    if (!/^\d{10}$/.test(form.emergencyContact)) {
      setErrorMsg("Emergency Contact must be exactly 10 digits");
      return;
    }

    if (form.drNumber && !/^\d{10}$/.test(form.drNumber)) {
      setErrorMsg("Doctor Number must be exactly 10 digits");
      return;
    }

    const payload = {
      ...form,
      dob: form.dob ? new Date(form.dob).toISOString() : null,
    };

    try {
      if (initialData) {
        await updateStudent(initialData._id, payload);
        alert("Student updated successfully!");
      } else {
        await addStudent(payload);
        alert("Student added successfully!");
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Failed to save student"
      );
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
          className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-auto"
        >
          {/* Header */}
          <div className="flex justify-between mb-4">
            <h2 className="text-3xl font-bold">{initialData ? "Edit Student" : "Add Student"}</h2>
            <button onClick={onClose}>
              <X className="w-7 h-7" />
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 font-semibold mb-4">{errorMsg}</p>
          )}

          <div className="grid grid-cols-2 gap-4">

            <Input label="Name" name="name" value={form.name} onChange={handleChange} />

            <Input
              label="Date of Birth"
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />

            {/* Category */}
            <Select
              label="Category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Select>

            {/* Academic Year */}
            <Select
              label="Academic Year"
              name="academicYearId"
              value={form.academicYearId}
              onChange={handleChange}
            >
              <option value="">Select Academic Year</option>
              {academicYears.map(y => (
                <option key={y._id} value={y._id}>{y.year}</option>
              ))}
            </Select>

            {/* Class */}
            <Select
              label="Class"
              name="classId"
              value={form.classId}
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.categoryId?.name} ({cls.name})
                </option>
              ))}
            </Select>

            <Input label="Behaviour" name="behaviour" value={form.behaviour} onChange={handleChange} />
            <Input label="Hobby" name="hobby" value={form.hobby} onChange={handleChange} />
            <Input label="Health Issues" name="healthIssues" value={form.healthIssues} onChange={handleChange} />
            <Input label="Emergency Contact" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
            <Input label="Consultant Doctor" name="consultantDr" value={form.consultantDr} onChange={handleChange} />
            <Input label="Doctor Number" name="drNumber" value={form.drNumber} onChange={handleChange} />
          </div>

          <div className="mt-6">
            <Button onClick={handleSubmit}>{initialData ? "Update" : "Submit"}</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddStudentModal;
