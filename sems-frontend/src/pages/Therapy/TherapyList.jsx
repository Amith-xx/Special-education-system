import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getTherapyColor, getTherapyIcon } from "./therapyUtils";

const TherapyList = ({ data, onSelect }) => {
  return (
    <div className="space-y-4">
      {data.map((therapy, index) => (
        <motion.div
          key={therapy._id || therapy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          whileHover={{ scale: 1.01, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          onClick={() => onSelect(therapy)}
        >
          <div className="p-4 md:p-6">
            {/* Mobile: stack vertically; Desktop: horizontal grid */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 md:items-center">

              {/* Date */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-xl text-center">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    {new Date(therapy.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Therapy Type */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getTherapyColor(
                      therapy.therapyType
                    )} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}
                  >
                    {getTherapyIcon(therapy.therapyType)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Type</p>
                    <p className="text-base font-bold text-gray-800 capitalize">{therapy.therapyType}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="md:col-span-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Notes</p>
                <p className="text-gray-700 text-sm line-clamp-2">{therapy.notes || "—"}</p>
              </div>

              {/* Progress */}
              <div className="md:col-span-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Progress</p>
                  </div>
                  <p className="text-green-700 font-semibold text-sm">{therapy.progress || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          />
        </motion.div>
      ))}

      {data.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
          No therapy records found for this student.
        </div>
      )}
    </div>
  );
};

export default TherapyList;
