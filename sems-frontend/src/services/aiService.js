import API from "../api/authApi";

export const generateStudentReport = async (studentData) => {
    try {
        const response = await API.post("/api/ai/generate-report", studentData);
        return response.data;
    } catch (error) {
        console.error("Error generating report:", error);
        throw new Error(
            error.response?.data?.message || "Failed to generate report"
        );
    }
};
