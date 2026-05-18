import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import Authentication from "./routes/AuthRoutes.js";
import AdminFunc from "./routes/AdminFunctions.js";
import TeacherFunc from "./routes/TeacherFunctions.js";
import TherapyRoutes from "./routes/TherapyRoutes.js";
import BehaviorRoutes from "./routes/BehaviorRoutes.js";
import AIRoutes from "./routes/AIRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "sems-frontend/dist")));

const PORT = process.env.PORT || 5050;

// Mount Routes
app.use("/auth", Authentication);          // login/register
app.use("/api/admin", AdminFunc);          // admin routes
app.use("/api/teacher", TeacherFunc);      // teacher routes
app.use("/api/therapy", TherapyRoutes);    // therapy logs
app.use("/api/behavior", BehaviorRoutes);  // behavior logs
app.use("/api/ai", AIRoutes);              // AI reports

// Fallback to frontend for client-side routing (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "sems-frontend/dist/index.html"));
});

// Only start HTTP server locally — Vercel invokes the app directly as a serverless function
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running → http://localhost:${PORT}`);
  });
}

export default app;
