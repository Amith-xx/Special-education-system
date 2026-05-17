import React from "react";
import { motion } from "framer-motion";
import MoodBadge from "../../components/MoodBadge";

const BehaviorTable = ({ data, onView }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center text-gray-400">
        No behavior logs found for this student.
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Date</th>
              <th className="px-6 py-4 text-left font-bold">Mood</th>
              <th className="px-6 py-4 text-left font-bold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log, index) => (
              <motion.tr
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="border-b hover:bg-blue-50/50 cursor-pointer"
                onClick={() => onView?.(log)}
              >
                <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                <td className="px-6 py-4"><MoodBadge mood={log.mood} /></td>
                <td className="px-6 py-4 text-gray-600">{log.notes || "—"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {data.map((log, index) => (
          <motion.div
            key={log._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="bg-white rounded-2xl shadow p-4 cursor-pointer"
            onClick={() => onView?.(log)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
              <MoodBadge mood={log.mood} />
            </div>
            {log.notes && <p className="text-sm text-gray-600 mt-1">{log.notes}</p>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BehaviorTable;
