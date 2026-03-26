import React from "react";

const Select = ({ label, children, ...props }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    {...props}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none bg-white"
                >
                    {children}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Select;
