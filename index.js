import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

const PORT = process.env.PORT || 5050;

// Mount Routes
app.use("/auth", Authentication);          // login/register
app.use("/api/admin", AdminFunc);          // admin routes
app.use("/api/teacher", TeacherFunc);      // teacher routes
app.use("/api/therapy", TherapyRoutes);    // therapy logs
app.use("/api/behavior", BehaviorRoutes);  // behavior logs
app.use("/api/ai", AIRoutes);              // AI reports

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
