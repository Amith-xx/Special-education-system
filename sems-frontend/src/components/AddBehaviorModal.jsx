// components/AddBehaviorModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { addBehaviorLog } from "../api/behaviorApi";

const AddBehaviorModal = ({ onClose, onAdded, students }) => {
  const [studentId, setStudentId] = useState("");
  const [mood, setMood] = useState("Happy");
  const [notes, setNotes] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!studentId) {
      alert("Please select a student");
      return;
    }

    try {
      const { data } = await addBehaviorLog({
        studentId,
        mood: mood.toLowerCase(),
        notes,
        date: today,
      });

      onAdded(data);
      onClose();
    } catch (err) {
      alert("Failed to add log");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add Behavior Log
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-700 hover:rotate-90 transition" />
          </button>
        </div>

        {/* Student */}
        <div>
          <label className="font-semibold text-gray-700">Student</label>
          <select
            className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-50 shadow-sm"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mood */}
        <div>
          <label className="font-semibold text-gray-700">Mood</label>
          <select
            className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-50 shadow-sm"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option>Happy</option>
            <option>Neutral</option>
            <option>Sad</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="font-semibold text-gray-700">Notes</label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-50 shadow-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!studentId}
          className={`w-full py-3 rounded-xl font-bold shadow-lg transition ${!studentId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            }`}
        >
          Save Log
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AddBehaviorModal;
