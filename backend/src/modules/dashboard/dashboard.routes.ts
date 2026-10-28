
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", dashboardController.getStats);

export default router;
