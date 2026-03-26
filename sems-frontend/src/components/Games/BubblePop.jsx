import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";

const BubblePop = ({ difficulty, onExit }) => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [missed, setMissed] = useState(0);
    const gameAreaRef = useRef(null);

    // Difficulty settings
    const spawnRate = difficulty === "easy" ? 1000 : 600;
    const speed = difficulty === "easy" ? 4 : 2; // duration in seconds (lower is faster)
    const bubbleSize = difficulty === "easy" ? 80 : 60;

    useEffect(() => {
        const interval = setInterval(() => {
            spawnBubble();
        }, spawnRate);

        return () => clearInterval(interval);
    }, []);

    const spawnBubble = () => {
    if (!gameAreaRef.current) return;

    const id = Date.now();
    const x = Math.random() * (gameAreaRef.current.clientWidth - bubbleSize);

    const colors = [
        "bg-blue-400",
        "bg-pink-400",
        "bg-purple-400",
        "bg-green-400",
        "bg-yellow-400",
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];

    setBubbles((prev) => [...prev, { id, x, color }]);

    // Remove bubble after animation duration (if not popped)
    setTimeout(() => {
        setBubbles((prev) => {
            const exists = prev.find((b) => b.id === id);
            if (exists) {
                setMissed((m) => m + 1);
                return prev.filter((b) => b.id !== id);
            }
            return prev;
        });
    }, speed * 1000);
};

    const popBubble = (id) => {
        setScore((prev) => prev + 1);
        setBubbles((prev) => prev.filter((b) => b.id !== id));
    };

    const handleBubbleMissed = (id) => {
        setMissed((prev) => prev + 1);
        setBubbles((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-200 to-blue-500 overflow-hidden flex flex-col z-50">
            <div className="flex justify-between p-6 z-10">
                <h2 className="text-3xl font-bold text-white drop-shadow-md">🫧 Bubble Pop</h2>
                <div className="flex gap-4 items-center">
                    <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold flex gap-2 items-center">
                        <Trophy className="text-yellow-300" /> {score}
                    </div>
                    <button onClick={onExit} className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition shadow-lg">
                        <X />
                    </button>
                </div>
            </div>

            <div ref={gameAreaRef} className="flex-1 relative w-full h-full">
                <AnimatePresence>
                    {bubbles.map((bubble) => (
                        <motion.button
                            key={bubble.id}
                            initial={{ y: "110%", x: bubble.x, opacity: 0.8, scale: 0 }}
                            animate={{ y: "-20%", opacity: 1, scale: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: speed, ease: "linear" }}
                            
                            onClick={() => popBubble(bubble.id)}
                            className={`absolute w-[80px] h-[80px] rounded-full ${bubble.color} shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),inset_5px_5px_15px_rgba(255,255,255,0.4)] border-2 border-white/30 cursor-pointer active:scale-95`}
                            style={{ width: bubbleSize, height: bubbleSize }}
                        >
                            <div className="w-4 h-4 bg-white/60 rounded-full absolute top-3 right-4 blur-[1px]"></div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-blue-600 to-transparent opacity-50 pointer-events-none"></div>
        </div>
    );
};

export default BubblePop;
