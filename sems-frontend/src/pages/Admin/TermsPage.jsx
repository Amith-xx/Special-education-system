import React, { useEffect, useState } from "react";
import { getTerms, deleteTerm } from "../../api/termApi";
import Sidebar from "../../components/Sidebar";
import AddTermModal from "./AddTermModal";

const TermsPage = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingTerm, setEditingTerm] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const res = await getTerms();
            setTerms(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch terms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this term?")) return;
        try {
            await deleteTerm(id);
            setTerms(terms.filter(t => t._id !== id));
        } catch (err) {
            alert("Failed to delete term");
        }
    };

    const handleEdit = (term) => {
        setEditingTerm(term);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingTerm(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingTerm(null);
        setIsModalOpen(false);
        fetchTerms();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeNav="Terms" />
            <div className="flex-1 p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Terms</h1>
                    <button
                        onClick={handleAddNew}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                    >
                        Add Term
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
                                    <th className="p-4 text-left">Academic Year</th>
                                    <th className="p-4 text-left">Start Date</th>
                                    <th className="p-4 text-left">End Date</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {terms.map((t) => (
                                    <tr key={t._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-bold">{t.schemaId?.year}</td>
                                        <td className="p-4">{new Date(t.startDate).toLocaleDateString()}</td>
                                        <td className="p-4">{new Date(t.endDate).toLocaleDateString()}</td>
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
                                {terms.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-500">No terms found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <AddTermModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={editingTerm}
                    onSuccess={handleCloseModal}
                />
            </div>
        </div>
    );
};

export default TermsPage;
