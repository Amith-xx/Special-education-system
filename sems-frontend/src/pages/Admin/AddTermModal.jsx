// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X } from "lucide-react";
// import Input from "../../components/UI/Input";
// import Button from "../../components/UI/Button";
// import { addTerm } from "../../api/termApi";

// const AddTermModal = ({ open, onClose }) => {
//   if (!open) return null;

//   const [form, setForm] = useState({
//     startDate: "",
//     endDate: "",
//     schemaId: "",
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     setError("");

//     if (!form.startDate || !form.endDate || !form.schemaId) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       await addTerm({
//         ...form,
//         startDate: new Date(form.startDate).toISOString(),
//         endDate: new Date(form.endDate).toISOString(),
//       });

//       alert("Term added successfully");
//       onClose();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to add term"
//       );
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//         <motion.div className="bg-white p-8 rounded-2xl w-full max-w-md">
//           <div className="flex justify-between mb-4">
//             <h2 className="text-2xl font-bold">Add Term</h2>
//             <button onClick={onClose}><X /></button>
//           </div>

//           {error && <p className="text-red-500 mb-3">{error}</p>}

//           <Input label="Start Date" type="date" name="startDate" onChange={handleChange} />
//           <Input label="End Date" type="date" name="endDate" onChange={handleChange} />
//           <Input label="Academic Schema ID" name="schemaId" onChange={handleChange} />

//           <Button onClick={handleSubmit}>Create Term</Button>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default AddTermModal;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { addTerm, updateTerm } from "../../api/termApi";
import { getAcademicYears } from "../../api/academicApi";

const AddTermModal = ({ open, onClose, initialData = null, onSuccess }) => {
  if (!open) return null;

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    schemaId: "",
  });

  const [academicYears, setAcademicYears] = useState([]);
  const [error, setError] = useState("");
  const [loadingYears, setLoadingYears] = useState(false);

  useEffect(() => {
    fetchAcademicYears();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setForm({
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        schemaId: initialData.schemaId?._id || initialData.schemaId || "",
      });
    } else {
      setForm({
        startDate: "",
        endDate: "",
        schemaId: "",
      });
    }
  }, [initialData, open]);

  const fetchAcademicYears = async () => {
    try {
      setLoadingYears(true);
      const res = await getAcademicYears();
      if (res.data.years) {
        setAcademicYears(res.data.years);
      } else {
        setAcademicYears(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Failed to load academic years");
    } finally {
      setLoadingYears(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.startDate || !form.endDate || !form.schemaId) {
      setError("All fields are required");
      return;
    }

    try {
      const payload = {
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        schemaId: form.schemaId,
      };

      if (initialData) {
        await updateTerm(initialData._id, payload);
        alert("Term updated successfully");
      } else {
        await addTerm(payload);
        alert("Term added successfully");
      }

      if (onSuccess) onSuccess();
      onClose();

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save term"
      );
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-2xl w-full max-w-md"
        >

          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">{initialData ? "Edit Term" : "Add Term"}</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {error && (
            <p className="text-red-500 mb-3 text-sm">{error}</p>
          )}

          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />

          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />

          {/* Academic Year Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Academic Year
            </label>

            <select
              name="schemaId"
              value={form.schemaId}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              disabled={loadingYears}
            >
              <option value="">
                {loadingYears
                  ? "Loading..."
                  : "Select Academic Year"}
              </option>

              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSubmit}>
            {initialData ? "Update Term" : "Create Term"}
          </Button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTermModal;
