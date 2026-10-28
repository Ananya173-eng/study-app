
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(50000).default(""),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  deadline: z.string().datetime().optional().nullable(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().max(50000).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    deadline: z.string().datetime().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
