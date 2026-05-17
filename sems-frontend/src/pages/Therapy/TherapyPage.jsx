import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";

import TherapyFilter from "./TherapyFilter";
import TherapyList from "./TherapyList";
import TherapyDetailsModal from "../../components/TherapyDetailsModal";
import AddTherapyModal from "../../components/addTherapyModal";

import { getStudents } from "../../api/studentApi";
import API from "../../api/authApi";

const TherapyPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [therapies, setTherapies] = useState([]);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Load students
  useEffect(() => {
    getStudents().then((res) => setStudents(res.data));
  }, []);

  // 🔹 Load therapies
  const fetchTherapies = () => {
    if (!selectedStudent) return;
    API.get("/api/therapy", {
      params: { studentId: selectedStudent },
    }).then((res) => setTherapies(res.data));
  };

  useEffect(fetchTherapies, [selectedStudent]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeNav="Therapy" />

      <div className="flex-1 p-4 pt-16 md:p-8 md:pt-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Therapy Tracking</h2>
          <motion.button
            onClick={() => setShowAddModal(true)}
            disabled={!selectedStudent}
            className="px-6 py-3 bg-green-600 text-white rounded-xl disabled:opacity-50 w-full md:w-auto"
          >
            + Add Therapy Report
          </motion.button>
        </div>

        <TherapyFilter
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          students={students}
        />

        <TherapyList
          data={therapies}
          onSelect={(t) => setSelectedTherapy(t)}
        />
      </div>

      {selectedTherapy && (
        <TherapyDetailsModal
          therapy={selectedTherapy}
          onClose={() => setSelectedTherapy(null)}
        />
      )}

      {showAddModal && (
        <AddTherapyModal
          studentId={selectedStudent}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchTherapies}
        />
      )}
    </div>
  );
};

export default TherapyPage;
