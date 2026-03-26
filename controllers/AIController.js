

export const generateStudentReport = async (req, res) => {
    try {
        const { student, evaluations = [], therapies = [], behaviors = [] } = req.body;

        // --- RULE-BASED ANALYSIS ---

        // 1. Academic Analysis
        let academicText = "No evaluation data available.";
        if (evaluations.length > 0) {
            const totalScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0);
            const avgScore = (totalScore / evaluations.length).toFixed(1);

            // Find strengths/weaknesses
            const sorted = [...evaluations].sort((a, b) => b.score - a.score);
            const best = sorted[0];
            const worst = sorted[sorted.length - 1];

            academicText = `Overall average score: ${avgScore}%. `;
            academicText += `Verified strengths in ${best.subjectId?.name || "a subject"} (${best.score}). `;
            if (worst && worst !== best) {
                academicText += `Requires attention in ${worst.subjectId?.name || "a subject"} (${worst.score}).`;
            }
        }

        // 2. Behavioral Analysis
        let behaviorText = "No behavior logs recorded.";
        let suggestionBehavior = "";
        if (behaviors.length > 0) {
            const negativeMoods = ["Aggressive", "Crying", "Restless", "Angry"];
            const positiveMoods = ["Happy", "Calm", "Focused", "Participative"];

            const negativeCount = behaviors.filter(b => negativeMoods.includes(b.mood)).length;
            const positiveCount = behaviors.filter(b => positiveMoods.includes(b.mood)).length;

            behaviorText = `Analyzed ${behaviors.length} logs. `;
            if (positiveCount > negativeCount) {
                behaviorText += "Student demonstrates predominantly positive behavior.";
                suggestionBehavior = "Continue positive reinforcement strategies.";
            } else {
                behaviorText += "Student shows frequent signs of distress or restlessness.";
                suggestionBehavior = "Review behavioral intervention plan and identify triggers.";
            }

            const recent = behaviors[0];
            behaviorText += ` Most recent mood: ${recent.mood} (${new Date(recent.date).toLocaleDateString()}).`;
        }

        // 3. Suggestions Generation
        const suggestions = [
            suggestionBehavior || "Monitor daily behavior for patterns.",
            evaluations.length > 0 && evaluations[0].score < 50 ? "Schedule remedial sessions for weak subjects." : "Maintain current academic support.",
            "Encourage participation in group activities.",
            "Regular communication with parents is recommended."
        ].filter(Boolean); // remove empty strings

        // 4. Construct Final JSON
        const reportData = {
            summary: `Automated Report for ${student.name}. ${academicText} ${behaviorText}`,
            academic: academicText,
            behavioral: behaviorText,
            therapies: therapies.length > 0
                ? `${therapies.length} therapy sessions recorded. Latest: ${therapies[0].therapyType} - ${therapies[0].progress}`
                : "No therapy records found.",
            suggestions: suggestions
        };

        res.json(reportData);

    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({
            message: "Failed to generate report",
            error: error.message
        });
    }
};
