import express from "express";
import { generateStudentReport } from "../controllers/AIController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/ai/generate-report
router.post("/generate-report", authenticate, generateStudentReport);

export default router;
