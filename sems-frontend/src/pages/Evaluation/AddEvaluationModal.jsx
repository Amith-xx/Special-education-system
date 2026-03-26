import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import API from "../../api/authApi";

const AddEvaluationModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    classId: "",
    studentId: "",
    subjectId: "",
    termId: "",
    score: "",
    remarks: "",
  });

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadDropdowns();
    }
  }, [open]);

  const loadDropdowns = async () => {
    try {
      const [classRes, subjectRes, termRes] = await Promise.all([
        API.get("/api/admin/classes"),
        API.get("/api/admin/subjects"),
        API.get("/api/admin/getTerms"),
      ]);

      setClasses(classRes.data);
      setSubjects(subjectRes.data);
      setTerms(termRes.data);
    } catch {
      setError("Failed to load form data");
    }
  };

  useEffect(() => {
    if (!form.classId) return;

    API.get("/api/admin/students", {
      params: { classId: form.classId },
    }).then((res) => setStudents(res.data));
  }, [form.classId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");

    if (!form.studentId || !form.subjectId || !form.termId || !form.score) {
      setError("All required fields must be filled");
      return;
    }

    try {
      await API.post("/api/teacher/addEvaluation", {
        studentId: form.studentId,
        classId: form.classId,   // ⭐ REQUIRED
        subjectId: form.subjectId,
        termId: form.termId,
        score: Number(form.score),
        remarks: form.remarks,
      });


      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add evaluation");
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold">Add Evaluation</h3>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <Select
            label="Class"
            name="classId"
            value={form.classId}
            onChange={handleChange}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.categoryId?.name} ({c.name})
              </option>
            ))}
          </Select>

          {/* Student */}
          <Select
            label="Student"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            disabled={!form.classId}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Select>

          {/* Subject */}
          <Select
            label="Subject"
            name="subjectId"
            value={form.subjectId}
            onChange={handleChange}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Select>

          {/* Term */}
          <Select
            label="Term"
            name="termId"
            value={form.termId}
            onChange={handleChange}
          >
            <option value="">Select Term</option>
            {terms.map((t) => (
              <option key={t._id} value={t._id}>
                {new Date(t.startDate).toLocaleDateString()}
              </option>
            ))}
          </Select>

          <Input
            label="Score (0-100)"
            type="number"
            name="score"
            placeholder="Score"
            value={form.score}
            onChange={handleChange}
          />

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Remarks (Optional)
            </label>
            <textarea
              name="remarks"
              placeholder="Enter remarks..."
              value={form.remarks}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm resize-none h-24"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full py-3 text-lg font-semibold shadow-md hover:bg-blue-700 transition-colors">
            Save Evaluation
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEvaluationModal;
