import React, { useEffect, useState } from "react";
import { getStudentDetails } from "../../api/studentApi";
import { generateStudentReport } from "../../services/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Sparkles, BookOpen, BrainCircuit, Activity, Lightbulb } from "lucide-react";

const StudentDetailsModal = ({ student: initialStudent, role, onClose }) => {
  const [data, setData] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");

  const studentId = initialStudent?._id;

  useEffect(() => {
    if (studentId) {
      getStudentDetails(studentId).then((res) => {
        setData(res.data);
      }).catch((err) => {
        console.error("Failed to load student details", err);
      });
    }
  }, [studentId]);

  const handleGenerateAIReport = async () => {
    setLoadingAI(true);
    setErrorAI("");
    setAiReport(null);
    try {
      const report = await generateStudentReport(data || { student: initialStudent });
      setAiReport(report);
    } catch (err) {
      console.error(err);
      setErrorAI("Failed to generate AI report. " + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  if (!initialStudent && !data) return null;

  const student = data?.student || initialStudent;
  const evaluations = data?.evaluations || [];
  const therapies = data?.therapies || [];

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >

          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-gray-500">Student Profile & Analytics</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-600 font-semibold uppercase">Category</p>
              <p className="text-lg font-medium text-gray-900">{student.categoryId?.name}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <p className="text-sm text-purple-600 font-semibold uppercase">Class</p>
              <p className="text-lg font-medium text-gray-900">{student.classId?.name}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <p className="text-sm text-green-600 font-semibold uppercase">Academic Year</p>
              <p className="text-lg font-medium text-gray-900">{student.academicYearId?.year}</p>
            </div>
          </div>

          {/* AI Student Report - TEACHERS ONLY */}
          {role === "teacher" && (
            <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                  <Bot className="w-6 h-6 text-indigo-600" />
                  AI Intelligence Report
                </h3>
                <button
                  onClick={handleGenerateAIReport}
                  disabled={loadingAI}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
                >
                  {loadingAI ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loadingAI ? "Analyzing Data..." : "Generate Analysis"}
                </button>
              </div>

              {errorAI && <p className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mb-4">{errorAI}</p>}

              {/* AI REPORT CONTENT */}
              {aiReport && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  {/* Summary Card */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" /> Executive Summary
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{aiReport.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> Academic Analysis
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{aiReport.academic}</p>
                    </div>

                    {/* Behavioral */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Behavioral Insights
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{aiReport.behavioral}</p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5" /> Recommended Strategies
                    </h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {Array.isArray(aiReport.suggestions) ? aiReport.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
                          <span className="min-w-6 h-6 flex items-center justify-center bg-green-100 text-green-700 rounded-full text-xs font-bold">{i + 1}</span>
                          <span className="mt-0.5">{s}</span>
                        </li>
                      )) : <p className="text-gray-500">No specific suggestions generated.</p>}
                    </ul>
                  </div>
                </div>
              )}

              {!aiReport && !loadingAI && !errorAI && (
                <div className="text-center py-8 text-gray-400">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Generate a comprehensive report to see insights here.</p>
                </div>
              )}
            </div>
          )}

          {/* EVALUATIONS - Hide for Admin */}
          {role !== "admin" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-500" /> Recent Evaluations
                </h3>
                {evaluations.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No evaluations recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden bg-white rounded-xl border shadow-sm">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                          <th className="p-4 text-left font-medium">Subject</th>
                          <th className="p-4 text-left font-medium">Score</th>
                          <th className="p-4 text-left font-medium">Remarks</th>
                          <th className="p-4 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {evaluations.map(ev => (
                          <tr key={ev._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">{ev.subjectId?.name || "Unknown"}</td>
                            <td className="p-4 text-blue-600 font-bold">{ev.score}</td>
                            <td className="p-4 text-gray-600 max-w-xs truncate" title={ev.remarks}>{ev.remarks || "-"}</td>
                            <td className="p-4 text-gray-500 text-sm">
                              {new Date(ev.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-500" /> Therapy Progress
                </h3>
                {therapies.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No therapy records found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {therapies.map(t => (
                      <div key={t._id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-gray-900">{t.therapyType}</p>
                          <span className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{t.progress}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentDetailsModal;
