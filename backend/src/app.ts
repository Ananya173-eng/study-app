
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import notesRoutes from "./modules/notes/notes.routes.js";
import tasksRoutes from "./modules/tasks/tasks.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import materialsRoutes from "./modules/materials/materials.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Study Hub API is running",
  });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const authReq = req as import("./middlewares/auth.middleware.js").AuthRequest;

  res.status(200).json({
    success: true,
    message: "Authentication successful",
    userId: authReq.userId,
  });
});

app.use("/api/notes", notesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/materials", materialsRoutes);
export default app;
