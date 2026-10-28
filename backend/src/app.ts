
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

// Root welcome & API status page
app.get("/", (_req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Study Hub Backend</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; line-height: 1.6; }
        .container { max-width: 680px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid #334155; }
        .badge { display: inline-block; background: #10b981; color: #022c22; font-weight: 700; padding: 4px 12px; border-radius: 9999px; font-size: 13px; margin-bottom: 12px; }
        h1 { margin: 0 0 12px; font-size: 26px; color: #ffffff; }
        p { color: #94a3b8; font-size: 15px; margin: 0 0 20px; }
        .card { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
        .endpoint { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
        .endpoint:last-child { border-bottom: none; }
        .method { font-weight: bold; padding: 2px 8px; border-radius: 6px; font-size: 12px; }
        .get { background: #0284c7; color: white; }
        .post { background: #16a34a; color: white; }
        .route { font-family: monospace; color: #38bdf8; text-decoration: none; }
        .route:hover { text-decoration: underline; }
        .btn { display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px; }
        .btn:hover { background: #4f46e5; }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="badge">● Server Active</span>
        <h1>AI Study Hub - Backend API</h1>
        <p>Aapka standalone Express backend server port 5000 par successfully chal raha hai! Ye ek API server hai jo JSON data provide karta hai.</p>
        
        <div class="card">
          <div class="endpoint">
            <div><span class="method get">GET</span> <a class="route" href="/api/health">/api/health</a></div>
            <span style="color:#94a3b8">Health Check (Clickable)</span>
          </div>
          <div class="endpoint">
            <div><span class="method get">GET</span> <a class="route" href="/api/dashboard">/api/dashboard</a></div>
            <span style="color:#94a3b8">Dashboard Stats (Token Required)</span>
          </div>
          <div class="endpoint">
            <div><span class="method post">POST</span> <span class="route">/api/auth/register</span></div>
            <span style="color:#94a3b8">Register User</span>
          </div>
          <div class="endpoint">
            <div><span class="method post">POST</span> <span class="route">/api/auth/login</span></div>
            <span style="color:#94a3b8">User Login</span>
          </div>
          <div class="endpoint">
            <div><span class="method get">GET</span> <span class="route">/api/notes</span></div>
            <span style="color:#94a3b8">Notes Management</span>
          </div>
          <div class="endpoint">
            <div><span class="method get">GET</span> <span class="route">/api/tasks</span></div>
            <span style="color:#94a3b8">Tasks & Deadlines</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #64748b;">
          💡 Frontend UI dekhne ke liye dusre terminal me <code>npm run dev</code> chalayein aur <code>http://localhost:3000</code> open karein.
        </p>
      </div>
    </body>
    </html>
  `);
});

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
