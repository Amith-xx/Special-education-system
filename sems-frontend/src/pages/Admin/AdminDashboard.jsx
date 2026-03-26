import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import AddStudentModal from "./AddStudentModal";
import AddCategoryModal from "./AddCategoryModal";
import AddAcademicYearModal from "./AddAcademicModal";
import StudentsPage from "./StudentsPage";
import AddClassModal from "./AddClassModal";
import AddTermModal from "./AddTermModal";
import AddSubjectModal from "./AddSubjectModal";  // ⭐ IMPORT THE NEW MODAL
import GamePortal from "../Games/GamePortal";   // ⭐ IMPORT THE GAMES PAGE
import { UserPlus, Users, BookOpen, Layers, Calendar } from "lucide-react";
import AddTeacherModal from "./AddTeacherModal";




const AdminDashboard = () => {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false); // ⭐ NEW STATE FOR SUBJECT MODAL


  // ⭐ NEW — track sidebar page
  const [activeNav, setActiveNav] = useState("Dashboard");

  const actions = [
    {
      name: "Add Teacher",
      icon: <UserPlus className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
      onClick: () => setShowTeacherModal(true),
    },
    {
      name: "Add Student",
      icon: <Users className="w-8 h-8" />,
      color: "from-green-500 to-green-700",
      onClick: () => setShowStudentModal(true),
    },
    {
      name: "Add Academic Schema",
      icon: <Layers className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700",
      onClick: () => setShowAcademicModal(true),
    },
    {
      name: "Add Term",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-pink-500 to-pink-700",
      onClick: () => setShowTermModal(true),
    },
    {
      name: "Add Class",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-amber-500 to-orange-700",
      onClick: () => setShowClassModal(true),
    },
    {
      name: "Add Category",
      icon: <Layers className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-700",
      onClick: () => setShowCategoryModal(true),
    },
    {
      name: "Add Subject",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-teal-500 to-emerald-600",
      onClick: () => setShowSubjectModal(true),
    },

  ];

  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* MAIN AREA */}
      <div className="flex-1 p-4 pt-16 md:p-10 md:pt-10 overflow-auto">

        {/* ⭐ If Games is selected, show Games page directly */}
        {activeNav === "Dashboard" && (
          <>
            <h1 className="text-4xl font-bold mb-8">
              Welcome to Admin Portal
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {actions.map((action, idx) => (
                <motion.div
                  key={idx}
                  className={`p-8 rounded-2xl shadow-xl cursor-pointer text-white bg-gradient-to-br ${action.color}`}
                  onClick={action.onClick}
                >
                  {action.icon}
                  <p>{action.name}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeNav === "Students" && <StudentsPage />}

        {activeNav === "Games" && <GamePortal hideSidebar />}

      </div>
      <AddTeacherModal
        open={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
      />


      <AddStudentModal
        open={showStudentModal}
        onClose={() => setShowStudentModal(false)}
      />
      <AddAcademicYearModal
        open={showAcademicModal}
        onClose={() => setShowAcademicModal(false)} />
      <AddClassModal
        open={showClassModal}
        onClose={() => setShowClassModal(false)} />
      <AddTermModal
        open={showTermModal}
        onClose={() => setShowTermModal(false)} />
      <AddCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)} />
      <AddSubjectModal
        open={showSubjectModal}
        onClose={() => setShowSubjectModal(false)} />
    </div>
  );
};


export default AdminDashboard;
