import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, HelpCircle, LayoutGrid } from "lucide-react";

const shapes = [
    { id: "red-circle", color: "bg-red-500", shape: "rounded-full" },
    { id: "blue-square", color: "bg-blue-500", shape: "rounded-lg" },
    { id: "green-triangle", color: "bg-green-500", shape: "clip-triangle" }, // Custom clipping needed or use icons
    { id: "yellow-star", color: "bg-yellow-400", shape: "rounded-md" }
];

// Simplified for CSS shapes
const items = [
    { id: "red", color: "bg-red-500" },
    { id: "blue", color: "bg-blue-500" },
    { id: "green", color: "bg-green-500" },
    { id: "yellow", color: "bg-yellow-400" }
];

const PatternMaster = ({ difficulty, onExit }) => {
    const [sequence, setSequence] = useState([]);
    const [options, setOptions] = useState([]);
    const [targetId, setTargetId] = useState(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        nextRound();
    }, []);

    const nextRound = () => {
        // Generate simple ABAB pattern or ABCABC
        const isComplex = difficulty !== "easy";
        const len = isComplex ? 3 : 2;

        // Pick 'len' random items for the pattern base
        const base = items.sort(() => 0.5 - Math.random()).slice(0, len);

        // Create sequence: Base + Base + Base[0] (for user to guess)
        // E.g. Red, Blue, Red, Blue, [?]
        let seq = [...base, ...base];
        if (isComplex) seq = [...base, ...base]; // 6 items for ABCABC

        const answer = seq.pop(); // Remove last item
        setTargetId(answer.id);
        setSequence(seq);

        setOptions(items); // Show all colors as options
        setFeedback("");
    };

    const handleSelect = (item) => {
        if (item.id === targetId) {
            setScore(score + 10);
            setFeedback("correct");
            setTimeout(nextRound, 1500);
        } else {
            setFeedback("wrong");
            setTimeout(() => setFeedback(""), 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col z-50">
            <div className="flex justify-between bg-white shadow p-6 items-center">
                <h2 className="text-3xl font-bold text-indigo-800 flex gap-2 items-center">
                    <LayoutGrid className="w-8 h-8" /> Pattern Master
                </h2>
                <div className="flex gap-3 items-center">
                    <div className="px-5 py-2 rounded-full text-xl font-bold bg-indigo-600 text-white shadow">
                        Score: {score}
                    </div>
                    <button onClick={onExit} className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition">
                        <X />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16 p-4">

                <div className="text-center">
                    <h3 className="text-2xl text-indigo-900 font-medium mb-8">What comes next?</h3>
                    <div className="flex gap-4 md:gap-6 bg-white/50 p-8 rounded-3xl backdrop-blur-sm shadow-xl items-center">
                        {sequence.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-2xl shadow-md border-4 border-white`}
                            />
                        ))}

                        {/* The Mystery Box */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity }}
                            className="w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center bg-white/30"
                        >
                            {feedback === "" && <HelpCircle className="text-indigo-500 w-10 h-10" />}
                            {feedback === "correct" && <span className="text-4xl">🎉</span>}
                            {feedback === "wrong" && <span className="text-4xl">❌</span>}
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    {options.map((opt, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSelect(opt)}
                            className={`w-20 h-20 md:w-24 md:h-24 ${opt.color} rounded-2xl shadow-lg border-4 border-white/50 hover:border-white transition-all`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default PatternMaster;
