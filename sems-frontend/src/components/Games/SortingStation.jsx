import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

// Categories
const categories = {
    fruits: { label: "Fruits", color: "bg-red-100 border-red-300", icon: "🍎" },
    animals: { label: "Animals", color: "bg-green-100 border-green-300", icon: "🐾" }
};

const items = [
    { id: 1, name: "Apple", icon: "🍎", type: "fruits" },
    { id: 2, name: "Banana", icon: "🍌", type: "fruits" },
    { id: 3, name: "Grapes", icon: "🍇", type: "fruits" },
    { id: 4, name: "Dog", icon: "🐶", type: "animals" },
    { id: 5, name: "Cat", icon: "🐱", type: "animals" },
    { id: 6, name: "Lion", icon: "🦁", type: "animals" }
];

const SortingStation = ({ difficulty, onExit }) => {
    const [currentItem, setCurrentItem] = useState(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    useEffect(() => {
        nextItem();
    }, []);

    const nextItem = () => {
        const random = items[Math.floor(Math.random() * items.length)];
        setCurrentItem(random);
        setFeedback(null);
    };

    const handleSort = (category) => {
        if (currentItem.type === category) {
            setScore(score + 10);
            setFeedback("correct");
            setTimeout(nextItem, 1000);
        } else {
            setFeedback("wrong");
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-amber-50 flex flex-col z-50">
            <div className="flex justify-between p-6 bg-white shadow-sm">
                <h2 className="text-3xl font-bold text-amber-800 flex items-center gap-2">🗂️ Sorting Station</h2>
                <div className="flex gap-4 items-center">
                    <span className="text-xl font-bold text-amber-700">Score: {score}</span>
                    <button onClick={onExit} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                        <X />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">

                {/* The Item Card */}
                <AnimatePresence mode="wait">
                    {currentItem && (
                        <motion.div
                            key={currentItem.id}
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-48 h-48 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-amber-200 z-10 mb-20"
                        >
                            <span className="text-8xl">{currentItem.icon}</span>
                            <span className="text-xl font-bold text-gray-600 mt-4">{currentItem.name}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {feedback === "correct" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className="absolute z-20 text-green-500 bg-white rounded-full p-4 shadow-xl"
                        >
                            <CheckCircle size={80} />
                        </motion.div>
                    )}
                    {feedback === "wrong" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className="absolute z-20 text-red-500 bg-white rounded-full p-4 shadow-xl"
                        >
                            <AlertCircle size={80} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bins */}
                <div className="absolute bottom-0 w-full h-1/3 flex">
                    <button
                        onClick={() => handleSort("fruits")}
                        className={`flex-1 ${categories.fruits.color} border-t-8 flex flex-col items-center justify-center hover:brightness-95 transition-all group`}
                    >
                        <span className="text-6xl group-hover:scale-110 transition-transform">{categories.fruits.icon}</span>
                        <span className="text-2xl font-bold text-red-800 mt-2">FRUITS</span>
                    </button>

                    <button
                        onClick={() => handleSort("animals")}
                        className={`flex-1 ${categories.animals.color} border-t-8 flex flex-col items-center justify-center hover:brightness-95 transition-all group`}
                    >
                        <span className="text-6xl group-hover:scale-110 transition-transform">{categories.animals.icon}</span>
                        <span className="text-2xl font-bold text-green-800 mt-2">ANIMALS</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SortingStation;
