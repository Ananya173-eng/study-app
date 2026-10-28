
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as tasksController from "./tasks.controller.js";

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

router.post("/", tasksController.create);
router.get("/", tasksController.getAll);
router.get("/:id", tasksController.getOne);
router.patch("/:id", tasksController.update);
router.delete("/:id", tasksController.remove);

export default router;
