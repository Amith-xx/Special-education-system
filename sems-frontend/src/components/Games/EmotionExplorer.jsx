import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Smile, Frown, Meh, Angry } from "lucide-react";

// Questions: Emotion -> Emoji/Icon mapping
const levels = {
    easy: [
        { id: "happy", icon: "😊", label: "Happy" },
        { id: "sad", icon: "😢", label: "Sad" }
    ],
    difficult: [
        { id: "happy", icon: "😄", label: "Happy" },
        { id: "sad", icon: "😭", label: "Sad" },
        { id: "angry", icon: "😠", label: "Angry" },
        { id: "surprised", icon: "😲", label: "Surprised" },
        { id: "scared", icon: "😨", label: "Scared" }
    ]
};

const EmotionExplorer = ({ difficulty, onExit }) => {
    const activeSet = difficulty === "easy" ? levels.easy : levels.difficult;
    const [target, setTarget] = useState(null);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        nextRound();
    }, []);

    const nextRound = () => {
        const t = activeSet[Math.floor(Math.random() * activeSet.length)];
        setTarget(t);

        // Shuffle options
        let opts = [...activeSet];
        // If difficult, pick 3 random options including target
        if (difficulty !== "easy") {
            opts = opts.sort(() => 0.5 - Math.random()).slice(0, 3);
            if (!opts.find(o => o.id === t.id)) {
                opts[0] = t; // Ensure target is present
            }
        }
        setOptions(opts.sort(() => 0.5 - Math.random()));
        setFeedback("");
    };

    const handleClick = (emotion) => {
        if (emotion.id === target.id) {
            setScore(score + 1);
            setFeedback("correct");
            setTimeout(nextRound, 1500);
        } else {
            setFeedback("wrong");
            setTimeout(() => setFeedback(""), 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 flex flex-col z-50">
            <div className="flex justify-between bg-white shadow p-6 items-center">
                <h2 className="text-3xl font-bold text-orange-600 flex gap-2 items-center">
                    <Smile className="w-8 h-8" /> Emotion Explorer
                </h2>
                <div className="flex gap-3 items-center">
                    <div className="px-6 py-2 rounded-full text-xl font-bold bg-green-500 text-white shadow-lg">
                        Score: {score}
                    </div>
                    <button onClick={onExit} className="p-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-12 p-4">
                {feedback === "" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <p className="text-4xl text-gray-700 font-medium mb-8">Can you find...</p>
                        <h1 className="text-7xl font-bold text-orange-600 drop-shadow-sm">{target?.label}?</h1>
                    </motion.div>
                )}

                {feedback === "correct" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.2 }}
                        className="text-8xl"
                    >
                        🎉
                    </motion.div>
                )}

                {feedback === "wrong" && (
                    <motion.div
                        animate={{ x: [-10, 10, -10, 10, 0] }}
                        className="text-8xl"
                    >
                        😔
                    </motion.div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {options.map((emotion, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleClick(emotion)}
                            className="w-40 h-40 md:w-48 md:h-48 flex items-center justify-center text-8xl rounded-3xl bg-white shadow-xl border-4 border-transparent hover:border-orange-300 transition-all"
                        >
                            {emotion.icon}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmotionExplorer;
