
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import * as dashboardService from "./dashboard.service.js";

export async function getStats(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const dashboard = await dashboardService.getDashboardStats(userId);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
}
