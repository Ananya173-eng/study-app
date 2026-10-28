
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "./notes.validation.js";
import * as notesService from "./notes.service.js";

export async function create(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const parsed = createNoteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid note data",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const note = await notesService.createNote(
      authReq.userId!,
      parsed.data
    );

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
}


export async function getAll(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : undefined;
  const category =
    typeof req.query.category === "string"
      ? req.query.category.trim()
      : undefined;

  try {
    const notes = await notesService.getNotes(authReq.userId!, {
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
    });

    return res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
}


export async function getOne(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const noteId = req.params.id as string;

  try {
    const note = await notesService.getNoteById(
      authReq.userId!,
      noteId
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch note",
    });
  }
}

export async function update(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const noteId = req.params.id as string;
  const parsed = updateNoteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid update data",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const note = await notesService.updateNote(
      authReq.userId!,
      noteId,
      parsed.data
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
}

export async function remove(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const noteId = req.params.id as string;

  try {
    const deleted = await notesService.deleteNote(
      authReq.userId!,
      noteId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
}
