import React from "react";

const Input = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
      />
    </div>
  );
};

export default Input;
