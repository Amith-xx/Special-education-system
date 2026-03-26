import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getTherapyColor, getTherapyIcon } from "./therapyUtils";

const TherapyList = ({ data, onSelect }) => {
  return (
    <div className="space-y-4">
      {data.map((therapy, index) => (
        <motion.div
          key={therapy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          whileHover={{ scale: 1.01, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          onClick={() => onSelect(therapy)}
        >
          <div className="p-6">
            <div className="grid grid-cols-12 gap-6 items-center">
              {/* Date */}
              <div className="col-span-2">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl text-center">
                  <p className="text-sm text-gray-600 font-medium">Date</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {new Date(therapy.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Therapy Type */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getTherapyColor(
                      therapy.therapyType
                    )} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {getTherapyIcon(therapy.therapyType)}
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Therapy Type
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {therapy.therapyType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Notes</p>
                <p className="text-gray-700">{therapy.notes}</p>
              </div>

              {/* Progress */}
              <div className="col-span-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-gray-600 font-medium">
                      Progress
                    </p>
                  </div>
                  <p className="text-green-700 font-semibold">
                    {therapy.progress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default TherapyList;
