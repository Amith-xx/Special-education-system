import React, { useEffect, useState } from "react";
import { getAcademicYears, deleteAcademicYear } from "../../api/academicApi";
import Sidebar from "../../components/Sidebar";
import AddAcademicYearModal from "./AddAcademicModal";

const AcademicYearsPage = () => {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingYear, setEditingYear] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchYears = async () => {
        try {
            setLoading(true);
            const res = await getAcademicYears();
            // Adjust structure if needed based on API response
            // AdminFunctions.js returns: res.json({ years }) -> so res.data.years
            if (res.data.years) {
                setYears(res.data.years);
            } else {
                // Fallback if structure is different
                setYears(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch academic years");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this academic year?")) return;
        try {
            await deleteAcademicYear(id);
            setYears(years.filter(y => y._id !== id));
        } catch (err) {
            alert("Failed to delete academic year");
        }
    };

    const handleEdit = (year) => {
        setEditingYear(year);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingYear(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingYear(null);
        setIsModalOpen(false);
        fetchYears();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeNav="Academic Years" />
            <div className="flex-1 p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Academic Years</h1>
                    <button
                        onClick={handleAddNew}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                        Add Academic Year
                    </button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Year</th>
                                    <th className="p-4 text-left">Created At</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {years.map((y) => (
                                    <tr key={y._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-bold">{y.year}</td>
                                        <td className="p-4">{new Date(y.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(y)}
                                                className="text-yellow-600 hover:text-yellow-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(y._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {years.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-gray-500">No academic years found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <AddAcademicYearModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingYear}
                    onSuccess={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default AcademicYearsPage;
