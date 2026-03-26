import React, { useEffect, useState } from "react";
import { getAllClasses, deleteClass } from "../../api/classApi";
import Sidebar from "../../components/Sidebar";
import AddClassModal from "./AddClassModal";

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingClass, setEditingClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const res = await getAllClasses();
            setClasses(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch classes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;
        try {
            await deleteClass(id);
            setClasses(classes.filter(c => c._id !== id));
        } catch (err) {
            alert("Failed to delete class");
        }
    };

    const handleEdit = (cls) => {
        setEditingClass(cls);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingClass(null);
        setIsModalOpen(false);
        fetchClasses();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeNav="Classes" />
            <div className="flex-1 p-4 pt-16 md:p-6 overflow-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold">Classes</h1>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                    >
                        Add Class
                    </button>
                </div>

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
                                    <th className="p-4 text-left">Category</th>
                                    <th className="p-4 text-left">Teacher</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((c) => (
                                    <tr key={c._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-medium">{c.name}</td>
                                        <td className="p-4">{c.categoryId?.name}</td>
                                        <td className="p-4">{c.teacherId?.fullName}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(c)}
                                                className="text-yellow-600 hover:text-yellow-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {classes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-500">No classes found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <AddClassModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingClass}
                    onSuccess={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default ClassesPage;
