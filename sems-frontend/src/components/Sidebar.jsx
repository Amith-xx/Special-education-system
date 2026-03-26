import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Target,
  Check,
  Eye,
  Gamepad2,
  LogOut,
  BookOpen,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    icon: Activity,
    path: "/admin/dashboard",
    roles: ["admin"],
  },
  {
    name: "Teachers",
    icon: Activity,
    path: "/admin/teachers",
    roles: ["admin"],
  },
  {
    name: "Dashboard",
    icon: Activity,
    path: "/teacher/dashboard",
    roles: ["teacher"],
  },
  {
    name: "Students",
    icon: Users, // Changed icon from Calendar to Users
    path: "/admin/students",
    roles: ["admin", "teacher"], // Added 'teacher' role
  },
  {
    name: "Behavior",
    icon: Eye,
    path: "/behavior",
    roles: ["teacher"],
  },
  {
    name: "Therapy",
    icon: Target,
    path: "/therapy",
    roles: ["teacher"],
  },
  {
    name: "Evaluation",
    icon: Check,
    path: "/evaluation",
    roles: ["teacher"],
  },
  {
    name: "Classes",
    icon: BookOpen,
    path: "/admin/classes",
    roles: ["admin"],
  },
  {
    name: "Terms",
    icon: Calendar,
    path: "/admin/terms",
    roles: ["admin"],
  },
  {
    name: "Subjects",
    icon: Target,
    path: "/admin/subjects",
    roles: ["admin"],
  },
  {
    name: "Games",
    icon: Gamepad2,
    path: "/games",
    roles: ["teacher"],
  },
  {
    name: "Academic Years",
    icon: Calendar,
    path: "/admin/academic-years",
    roles: ["admin"],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role"); // admin | teacher

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: window.innerWidth >= 768 ? 0 : isOpen ? 0 : -280 }}
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Student Portal</h1>
          <p className="text-sm text-blue-300 mt-1">{fullName}</p>
          <p className="text-xs text-blue-400 uppercase tracking-wider">
            {role}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false); // Close on mobile navigation
                  }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition
                  ${isActive
                      ? "bg-blue-700 shadow-lg"
                      : "hover:bg-blue-800/50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-red-300 hover:bg-red-600/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
