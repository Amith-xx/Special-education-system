// routes/BehaviorRoutes.js
import express from "express";
import BehaviorLog from "../models/BehaviorLogModel.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   ADD BEHAVIOR LOG
========================= */
router.post("/add", authenticate, async (req, res) => {
  try {
    const { studentId, mood, notes, date } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student is required" });
    }

    const log = await BehaviorLog.create({
      studentId,
      mood,
      notes,
      date: date ? new Date(date) : new Date(),
      createdBy: req.user.id,
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("Add behavior error:", err);
    res.status(500).json({ message: "Failed to add log" });
  }
});

/* =========================
   GET BEHAVIOR LOGS
========================= */
router.get("/", authenticate, async (req, res) => {
  try {
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { studentId } = req.query;
    const filter = {};

    if (studentId) {
      filter.studentId = studentId;
    }

    const logs = await BehaviorLog.find(filter)
      .populate("studentId")
      .sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    console.error("Fetch behavior logs error:", err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

export default router;
