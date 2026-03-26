

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import {
    Users,
    BookOpen,
    ClipboardCheck,
    PlusCircle,
    GraduationCap,
} from "lucide-react";
import { getTeacherClasses, getEvaluations } from "../../api/teacherApi";
import { getStudents } from "../../api/studentApi";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        classes: 0,
        students: 0,
        evaluations: 0
    });
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("Teacher");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const storedName = localStorage.getItem("fullName");
                if (storedName) setUsername(storedName);

                // Fetch parallel data
                const [classesRes, studentsRes, evaluationsRes] = await Promise.allSettled([
                    getTeacherClasses(),
                    getStudents(),
                    getEvaluations()
                ]);

                const newStats = {
                    classes: 0,
                    students: 0,
                    evaluations: 0
                };

                let fetchedClasses = [];
                let fetchedStudents = [];

                if (classesRes.status === "fulfilled") {
                    fetchedClasses = classesRes.value.data || [];
                    newStats.classes = fetchedClasses.length;
                }

                if (studentsRes.status === "fulfilled") {
                    fetchedStudents = studentsRes.value.data || [];
                    newStats.students = fetchedStudents.length;
                }

                if (evaluationsRes.status === "fulfilled") {
                    const evalData = evaluationsRes.value.data || [];
                    newStats.evaluations = evalData.length;
                }

                setStats(newStats);

                // Map classes with calculated student counts
                const classesWithCounts = fetchedClasses.map(cls => {
                    const studentCount = fetchedStudents.filter(
                        s => s.classId?._id === cls._id || s.classId === cls._id
                    ).length;

                    return {
                        ...cls,
                        studentsCount: studentCount
                    };
                });

                setClasses(classesWithCounts);

            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeNav="Dashboard" />

            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4 md:px-8 pl-14 md:pl-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-gray-500">Welcome back, {username}</p>
                        </div>
                        <div className="text-sm text-gray-400">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={BookOpen}
                                label="My Classes"
                                value={stats.classes}
                                color="bg-blue-500"
                                loading={loading}
                            />
                            <StatCard
                                icon={Users}
                                label="Total Students"
                                value={stats.students}
                                color="bg-emerald-500"
                                loading={loading}
                            />
                            <StatCard
                                icon={ClipboardCheck}
                                label="Evaluations"
                                value={stats.evaluations}
                                color="bg-purple-500"
                                loading={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Classes / Schedule List */}
                            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-blue-600" />
                                        My Classes
                                    </h2>
                                </div>

                                {loading ? (
                                    <div className="animate-pulse space-y-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
                                    </div>
                                ) : classes.length > 0 ? (
                                    <div className="space-y-3">
                                        {classes.map((cls, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 font-semibold group-hover:scale-110 transition-transform">
                                                        {cls.name?.charAt(0) || "C"}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{cls.name || "Class Name"}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {cls.studentsCount || 0} Students
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-medium px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                                                    {cls.categoryId?.name || "General"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl">
                                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No classes assigned yet.</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <PlusCircle className="w-5 h-5 text-blue-600" />
                                    Quick Actions
                                </h2>
                                <div className="space-y-3">
                                    
                                    <ActionButton
                                        label="New Evaluation"
                                        icon={ClipboardCheck}
                                        onClick={() => navigate('/evaluation')}
                                        color="text-purple-600 bg-purple-50 hover:bg-purple-100"
                                    />
                                    <ActionButton
                                        label="View Behavior"
                                        icon={ClipboardCheck}
                                        onClick={() => navigate('/behavior')}
                                        color="text-orange-600 bg-orange-50 hover:bg-orange-100"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} text-white shadow-md`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            )}
        </div>
    </motion.div>
);

const ActionButton = ({ label, icon: Icon, onClick, color }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${color}`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </button>
);

export default TeacherDashboard;

