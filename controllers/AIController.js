import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateStudentReport = async (req, res) => {
    try {
        const { student, evaluations = [], therapies = [], behaviors = [] } = req.body;

        if (!student) {
            return res.status(400).json({ message: "Student data is required" });
        }

        // ── Rule-based analysis (always runs as fallback / enrichment) ──

        // 1. Academic Analysis
        let academicText = "No evaluation data available.";
        if (evaluations.length > 0) {
            const totalScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0);
            const avgScore = (totalScore / evaluations.length).toFixed(1);
            const sorted = [...evaluations].sort((a, b) => b.score - a.score);
            const best = sorted[0];
            const worst = sorted[sorted.length - 1];

            academicText = `Overall average score: ${avgScore}%. `;
            academicText += `Best performance in ${best.subjectId?.name || "a subject"} (${best.score}%). `;
            if (worst._id !== best._id) {
                academicText += `Needs attention in ${worst.subjectId?.name || "a subject"} (${worst.score}%).`;
            }
        }

        // 2. Behavioral Analysis — moods stored as lowercase: "happy", "neutral", "sad"
        let behaviorText = "No behavior logs recorded.";
        let suggestionBehavior = "";
        if (behaviors.length > 0) {
            const happyCount   = behaviors.filter(b => b.mood === "happy").length;
            const neutralCount = behaviors.filter(b => b.mood === "neutral").length;
            const sadCount     = behaviors.filter(b => b.mood === "sad").length;

            behaviorText = `Analyzed ${behaviors.length} behavior logs: ${happyCount} happy, ${neutralCount} neutral, ${sadCount} sad. `;

            if (happyCount >= sadCount) {
                behaviorText += "Student generally demonstrates positive behavior.";
                suggestionBehavior = "Continue positive reinforcement strategies.";
            } else {
                behaviorText += "Student shows frequent signs of distress or low mood.";
                suggestionBehavior = "Review behavioral intervention plan and identify emotional triggers.";
            }

            const recent = behaviors[0];
            behaviorText += ` Most recent mood: ${recent.mood} (${new Date(recent.date).toLocaleDateString()}).`;
        }

        // 3. Therapy Summary
        let therapyText = "No therapy records found.";
        if (therapies.length > 0) {
            const typeCount = therapies.reduce((acc, t) => {
                acc[t.therapyType] = (acc[t.therapyType] || 0) + 1;
                return acc;
            }, {});
            const typeSummary = Object.entries(typeCount).map(([k, v]) => `${k} (${v})`).join(", ");
            therapyText = `${therapies.length} therapy session(s) recorded: ${typeSummary}. Latest: ${therapies[0].therapyType} — ${therapies[0].progress || "no progress notes"}.`;
        }

        // 4. Suggestions
        const avgScore = evaluations.length > 0
            ? evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length
            : null;

        const ruleSuggestions = [
            suggestionBehavior || "Monitor daily behavior for patterns.",
            avgScore !== null && avgScore < 50 ? "Schedule remedial sessions for subjects with low scores." : "Maintain current academic support strategies.",
            "Encourage participation in structured group activities.",
            "Regular communication with parents/guardians is recommended.",
        ].filter(Boolean);

        // ── Try Gemini AI for richer analysis ──
        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const evalSummary = evaluations.length > 0
                    ? evaluations.map(e => `- ${e.subjectId?.name || "Subject"}: ${e.score}/100${e.remarks ? ` (${e.remarks})` : ""}`).join("\n")
                    : "No evaluations recorded.";

                const behaviorSummary = behaviors.length > 0
                    ? behaviors.slice(0, 10).map(b => `- ${b.mood} on ${new Date(b.date).toLocaleDateString()}${b.notes ? `: ${b.notes}` : ""}`).join("\n")
                    : "No behavior logs.";

                const therapySummary = therapies.length > 0
                    ? therapies.slice(0, 10).map(t => `- ${t.therapyType} on ${new Date(t.date).toLocaleDateString()}: ${t.progress || "no notes"}`).join("\n")
                    : "No therapy records.";

                const prompt = `You are an expert special education analyst. Generate a professional student assessment report based on the data below.

Student: ${student.name}
Category/Disability: ${student.categoryId?.name || "Not specified"}
Class: ${student.classId?.name || "Not specified"}

Academic Evaluations:
${evalSummary}

Behavior Logs (recent):
${behaviorSummary}

Therapy Sessions (recent):
${therapySummary}

Respond in the following JSON format ONLY (no extra text, no markdown):
{
  "summary": "2-3 sentence executive summary of the student's overall progress",
  "academic": "Detailed academic analysis paragraph",
  "behavioral": "Detailed behavioral insights paragraph",
  "therapies": "Therapy progress analysis paragraph",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"]
}`;

                const result = await model.generateContent(prompt);
                const text = result.response.text().trim();

                // Strip markdown code fences if present
                const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
                const aiReport = JSON.parse(cleaned);

                return res.json(aiReport);
            } catch (aiErr) {
                console.error("Gemini AI error, falling back to rule-based:", aiErr.message);
                // Fall through to rule-based response below
            }
        }

        // ── Rule-based fallback response ──
        const reportData = {
            summary: `Report for ${student.name}. ${academicText} ${behaviorText}`,
            academic: academicText,
            behavioral: behaviorText,
            therapies: therapyText,
            suggestions: ruleSuggestions,
        };

        res.json(reportData);

    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({
            message: "Failed to generate report",
            error: error.message,
        });
    }
};
