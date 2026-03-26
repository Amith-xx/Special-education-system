import React from "react";
import { Smile, Frown, Meh } from "lucide-react";

export const getMoodIcon = (mood) => {
  switch (mood?.toLowerCase()) {
    case "happy":
      return <Smile className="w-5 h-5" />;
    case "sad":
      return <Frown className="w-5 h-5" />;
    case "neutral":
      return <Meh className="w-5 h-5" />;
    default:
      return <Meh className="w-5 h-5" />;
  }
};

export const getMoodColor = (mood) => {
  switch (mood?.toLowerCase()) {
    case "happy":
      return "bg-green-500";
    case "sad":
      return "bg-red-500";
    case "neutral":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const MoodBadge = ({ mood }) => {
  const formatted = mood
    ? mood.charAt(0).toUpperCase() + mood.slice(1)
    : "Neutral";

  return (
    <span
      className={`${getMoodColor(
        mood
      )} text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 shadow-md`}
    >
      {getMoodIcon(mood)}
      {formatted}
    </span>
  );
};

export default MoodBadge;