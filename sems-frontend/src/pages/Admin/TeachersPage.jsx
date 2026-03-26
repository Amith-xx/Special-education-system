import React, { useEffect, useState } from "react";
import API from "../../api/authApi";
import Sidebar from "../../components/Sidebar";
import EditTeacherModal from "./EditTeacherModal";

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/admin/getTeachers");
            setTeachers(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch teachers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this teacher?")) return;
        try {
            await API.delete(`/api/admin/deleteTeacher/${id}`);
            setTeachers(teachers.filter(t => t._id !== id));
        } catch (err) {
            alert("Failed to delete teacher");
        }
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setIsEditModalOpen(true);
    };

    const handleCloseEdit = () => {
        setEditingTeacher(null);
        setIsEditModalOpen(false);
        fetchTeachers();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeNav="Teachers" />
            <div className="flex-1 p-4 pt-16 md:p-6 overflow-auto">
                <h1 className="text-3xl font-bold mb-6">Teachers</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((t) => (
                                    <tr key={t._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">{t.fullName}</td>
                                        <td className="p-4">{t.email}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="text-yellow-600 hover:text-yellow-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {teachers.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-gray-500">No teachers found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <EditTeacherModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    teacher={editingTeacher}
                    onSuccess={handleCloseEdit}
                />
            </div>
        </div>
    );
};

export default TeachersPage;
