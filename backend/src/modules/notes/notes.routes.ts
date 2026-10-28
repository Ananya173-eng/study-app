
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as notesController from "./notes.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", notesController.create);
router.get("/", notesController.getAll);
router.get("/:id", notesController.getOne);
router.patch("/:id", notesController.update);
router.delete("/:id", notesController.remove);

export default router;
