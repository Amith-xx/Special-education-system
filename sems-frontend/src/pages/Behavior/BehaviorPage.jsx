// pages/Behavior/BehaviorPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import BehaviorFilter from "./BehaviorFilter";
import BehaviorTable from "./BehaviorTable";
import BehaviorDetailsModal from "../../components/BehaviorDetailsModal";
import AddBehaviorModal from "../../components/AddBehaviorModal";
import { getStudents } from "../../api/studentApi";
import { getBehaviorLogs } from "../../api/behaviorApi";

const BehaviorPage = () => {
  const [activeNav, setActiveNav] = useState("Behavior");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data));
  }, []);

  const fetchBehaviorLogs = () => {
    if (!selectedStudent) {
      setLogs([]);
      return;
    }

    getBehaviorLogs({ studentId: selectedStudent })
      .then((res) => setLogs(res.data));
  };

  useEffect(fetchBehaviorLogs, [selectedStudent]);

  const handleAdded = (newLog) => {
    // add immediately if same student selected
    if (newLog.studentId === selectedStudent || newLog.studentId?._id === selectedStudent) {
      setLogs((prev) => [newLog, ...prev]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Behavior Tracking</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600
            text-white rounded-xl shadow-lg hover:shadow-xl transition"
          >
            + Add Log
          </button>
        </div>

        <BehaviorFilter
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          students={students}
        />

        <BehaviorTable data={logs} onView={(log) => setSelectedLog(log)} />

        <BehaviorDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />

        {showAddModal && (
          <AddBehaviorModal
            onClose={() => setShowAddModal(false)}
            onAdded={handleAdded}
            students={students}
          />
        )}
      </div>
    </div>
  );
};

export default BehaviorPage;
