import { z } from "zod";

export const createMaterialSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
