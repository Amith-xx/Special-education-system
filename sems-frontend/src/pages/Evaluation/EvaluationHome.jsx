import React, { useEffect, useState } from "react";
import { Eye, Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/UI/Button";
import AddEvaluationModal from "./AddEvaluationModal";
import API from "../../api/authApi";

const EvaluationPage = () => {
  const [activeNav, setActiveNav] = useState("Evaluation");
  const [evaluations, setEvaluations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const res = await API.get("/api/teacher/evaluations");
      setEvaluations(res.data);
    } catch (err) {
      console.error("Failed to fetch evaluations");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="flex-1 overflow-auto p-4 pt-16 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">Evaluations</h2>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Evaluation
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4">Term</th>
                <th className="p-4">Score</th>
                <th className="p-4">Evaluated By</th>
                <th className="p-4">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((e) => (
                <tr key={e._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-left">
                    {e.studentId?.name || "-"}
                  </td>

                  <td className="p-4 text-left">
                    {e.subjectId?.name || "-"}
                  </td>

                  <td className="p-4 text-center">
                    {e.termId?.startDate
                      ? new Date(e.termId.startDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4 font-bold text-center">
                    {e.score}
                  </td>

                  <td className="p-4 text-left">
                    {e.evaluatedBy?.fullName}
                  </td>

                  <td className="p-4 text-center">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Add Evaluation Modal */}
      <AddEvaluationModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchEvaluations}
      />
    </div>
  );
};

export default EvaluationPage;
