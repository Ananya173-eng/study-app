
import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().max(50000).default(""),
  category: z.string().trim().min(1).max(50).default("General"),
});

export const updateNoteSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().max(50000).optional(),
  category: z.string().trim().min(1).max(50).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update" }
);

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
