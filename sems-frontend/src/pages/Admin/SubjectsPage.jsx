import React, { useEffect, useState } from "react";
import { getSubjects, deleteSubject } from "../../api/subjectApi";
import Sidebar from "../../components/Sidebar";
import AddSubjectModal from "./AddSubjectModal";

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingSubject, setEditingSubject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await getSubjects();
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch subjects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;
        try {
            await deleteSubject(id);
            setSubjects(subjects.filter(s => s._id !== id));
        } catch (err) {
            alert("Failed to delete subject");
        }
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingSubject(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingSubject(null);
        setIsModalOpen(false);
        fetchSubjects();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeNav="Subjects" />
            <div className="flex-1 p-4 pt-16 md:p-6 overflow-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold">Subjects</h1>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                    >
                        Add Subject
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-4 text-left">Name</th>
                                        <th className="p-4 text-left">Category</th>
                                        <th className="p-4 text-left">Term</th>
                                        <th className="p-4 text-left">Teacher</th>
                                        <th className="p-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((s) => (
                                        <tr key={s._id} className="border-t hover:bg-gray-50">
                                            <td className="p-4 font-medium">{s.name}</td>
                                            <td className="p-4">{s.categoryId?.name}</td>
                                            <td className="p-4">
                                                {s.termId ? `${new Date(s.termId.startDate).toLocaleDateString()} – ${new Date(s.termId.endDate).toLocaleDateString()}` : "-"}
                                            </td>
                                            <td className="p-4">{s.teacherId?.fullName}</td>
                                            <td className="p-4 flex gap-2">
                                                <button onClick={() => handleEdit(s)} className="text-yellow-600 hover:text-yellow-800">Edit</button>
                                                <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {subjects.length === 0 && (
                                        <tr><td colSpan="5" className="p-4 text-center text-gray-500">No subjects found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {subjects.length === 0 && <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">No subjects found</div>}
                            {subjects.map((s) => (
                                <div key={s._id} className="bg-white rounded-xl shadow p-4 space-y-1">
                                    <p className="font-bold text-gray-800">{s.name}</p>
                                    <p className="text-sm text-gray-500">{s.categoryId?.name}</p>
                                    <p className="text-sm text-gray-500">Teacher: {s.teacherId?.fullName}</p>
                                    {s.termId && <p className="text-xs text-gray-400">{new Date(s.termId.startDate).toLocaleDateString()} – {new Date(s.termId.endDate).toLocaleDateString()}</p>}
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => handleEdit(s)} className="text-yellow-600 text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDelete(s._id)} className="text-red-600 text-sm font-medium">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <AddSubjectModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingSubject}
                    onSuccess={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default SubjectsPage;
