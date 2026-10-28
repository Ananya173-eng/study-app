import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as materialsController from "./materials.controller.js";
import upload from "./materials.upload.js";

const router = Router();

// All study material routes require authentication.
router.use(authMiddleware);

// Get all study materials
router.get("/", materialsController.getAll);

router.post("/", upload.single("file"), materialsController.upload);

// Get one study material
router.get("/:id", materialsController.getOne);

// Delete one study material
router.delete("/:id", materialsController.remove);

export default router;