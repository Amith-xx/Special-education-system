import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import API from "../../api/authApi";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

const EditTeacherModal = ({ open, onClose, teacher, onSuccess }) => {
    if (!open || !teacher) return null;

    const [form, setForm] = useState({
        fullName: "",
        email: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (teacher) {
            setForm({
                fullName: teacher.fullName || "",
                email: teacher.email || "",
            });
        }
    }, [teacher]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setErrorMsg("");
        try {
            await API.put(`/api/admin/updateTeacher/${teacher._id}`, form);
            alert("Teacher updated successfully!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Failed to update teacher");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
                onClick={onClose}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
                >
                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold">Edit Teacher</h2>
                        <button onClick={onClose}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {errorMsg && (
                        <p className="text-red-500 font-semibold mb-4">{errorMsg}</p>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                        <Input
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mt-6">
                        <Button onClick={handleSubmit}>Update</Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditTeacherModal;
