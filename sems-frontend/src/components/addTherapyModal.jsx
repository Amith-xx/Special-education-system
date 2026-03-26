import React, { useState } from "react";
import API from "../api/authApi";

const AddTherapyModal = ({ studentId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    date: "",
    therapyType: "",
    notes: "",
    progress: "",
  });

  const handleSubmit = async () => {
    if (!studentId || !form.therapyType) {
      alert("Student & Therapy Type are required");
      return;
    }

    try {
      await API.post("/api/therapy/add", {
        studentId,
        therapyType: form.therapyType,
        notes: form.notes,
        progress: form.progress,
        date: form.date || undefined,
      });

      onSuccess(); // refresh list
      onClose();   // close modal
    } catch (err) {
      console.error("Add therapy failed", err.response?.data || err.message);
      alert("Failed to add therapy report");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h3 className="text-xl font-bold">Add Therapy Report</h3>

        {/* Date */}
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* Therapy Type */}
        <select
          value={form.therapyType}
          onChange={(e) =>
            setForm({ ...form, therapyType: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select Therapy Type</option>
          <option value="speech">Speech Therapy</option>
          <option value="occupational">Occupational Therapy</option>
          <option value="physio">Physiotherapy</option>
        </select>

        {/* Notes */}
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* Progress */}
        <input
          placeholder="Progress"
          value={form.progress}
          onChange={(e) => setForm({ ...form, progress: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTherapyModal;
