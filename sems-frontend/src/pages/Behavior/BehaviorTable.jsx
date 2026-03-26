// pages/Behavior/BehaviorTable.jsx
import React from "react";
import { motion } from "framer-motion";
import MoodBadge from "../../components/MoodBadge";

const BehaviorTable = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
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
              transition={{ delay: 0.1 * index }}
              className="border-b hover:bg-blue-50/50"
            >
              <td className="px-6 py-4">
                {new Date(log.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <MoodBadge mood={log.mood} />
              </td>
              <td className="px-6 py-4">{log.notes}</td>
            </motion.tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                No behavior logs found for this student
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BehaviorTable;
