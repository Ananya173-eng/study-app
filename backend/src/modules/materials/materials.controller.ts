
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import * as materialsService from "./materials.service.js";
import { createMaterialSchema } from "./materials.validation.js";
import { extractPdfText } from "./materials.pdf.js";

const uploadsDirectory = path.resolve("uploads");
const MAX_EXTRACTED_TEXT_LENGTH = 500_000;

export async function upload(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const file = (req as Request & {
    file?: Express.Multer.File;
  }).file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Please select a PDF or TXT file",
    });
  }

  let savedFilePath: string | undefined;

  try {
    const parsed = createMaterialSchema.safeParse({
      title: typeof req.body?.title === "string" ? req.body.title : undefined,
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid material details",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const originalName = path.basename(file.originalname);
    const extension = path.extname(originalName).toLowerCase();

    if (
      ![".pdf", ".txt"].includes(extension) ||
      !["application/pdf", "text/plain"].includes(file.mimetype)
    ) {
      return res.status(400).json({
        success: false,
        message: "Only PDF and TXT files are allowed",
      });
    }

    // Check the actual file signature rather than trusting its name alone.
    if (extension === ".pdf" && file.buffer.subarray(0, 5).toString() !== "%PDF-") {
      return res.status(400).json({
        success: false,
        message: "The uploaded file is not a valid PDF",
      });
    }

    if (extension === ".txt" && file.buffer.includes(0)) {
      return res.status(400).json({
        success: false,
        message: "The TXT file contains invalid binary data",
      });
    }

    let extractedText: string;

    if (extension === ".pdf") {
      extractedText = await extractPdfText(file.buffer);
    } else {
      extractedText = file.buffer.toString("utf8");
    }

    if (extractedText.length > MAX_EXTRACTED_TEXT_LENGTH) {
      extractedText = extractedText.slice(0, MAX_EXTRACTED_TEXT_LENGTH);
    }

    const title =
      parsed.data.title?.trim() ||
      path.parse(originalName).name.slice(0, 200) ||
      "Study Material";

    await mkdir(uploadsDirectory, { recursive: true });

    const storedFileName = `${randomUUID()}${extension}`;
    savedFilePath = path.join(uploadsDirectory, storedFileName);

    await writeFile(savedFilePath, file.buffer, { flag: "wx" });

    const material = await materialsService.createMaterial(userId, {
      title,
      fileName: originalName,
      fileUrl: storedFileName,
      mimeType: file.mimetype,
      extractedText,
    });

    return res.status(201).json({
      success: true,
      message: "Study material uploaded successfully",
      data: {
        id: material.id,
        title: material.title,
        fileName: material.fileName,
        mimeType: material.mimeType,
        createdAt: material.createdAt,
      },
    });
  } catch (error) {
    if (savedFilePath) {
      await unlink(savedFilePath).catch(() => undefined);
    }

    console.error("Upload material error:", error);

    return res.status(400).json({
      success: false,
      message: "Unable to process the uploaded file. Please check the file and try again.",
    });
  }
}

export async function getAll(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const materials = await materialsService.getMaterials(userId);

    return res.status(200).json({
      success: true,
      message: "Study materials fetched successfully",
      data: materials,
    });
  } catch (error) {
    console.error("Get materials error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study materials",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid material ID",
    });
  }

  try {
    const material = await materialsService.getMaterialById(userId, id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Study material fetched successfully",
      data: material,
    });
  } catch (error) {
    console.error("Get material error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study material",
    });
  }
}

export async function remove(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid material ID",
    });
  }

  try {
    const material = await materialsService.getMaterialById(userId, id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    const result = await materialsService.deleteMaterial(userId, id);

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    const storedFileName = path.basename(material.fileUrl);
    await unlink(path.join(uploadsDirectory, storedFileName)).catch(() => undefined);

    return res.status(200).json({
      success: true,
      message: "Study material deleted successfully",
    });
  } catch (error) {
    console.error("Delete material error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete study material",
    });
  }
}
