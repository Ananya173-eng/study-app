
import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "./tasks.validation.js";
import * as tasksService from "./tasks.service.js";

export async function create(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task data",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const task = await tasksService.createTask(userId, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
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

  const validStatuses = ["TODO", "IN_PROGRESS", "COMPLETED"] as const;
  const validPriorities = ["LOW", "MEDIUM", "HIGH"] as const;

  const status =
    typeof req.query.status === "string" &&
    validStatuses.includes(req.query.status as (typeof validStatuses)[number])
      ? (req.query.status as (typeof validStatuses)[number])
      : undefined;

  const priority =
    typeof req.query.priority === "string" &&
    validPriorities.includes(
      req.query.priority as (typeof validPriorities)[number]
    )
      ? (req.query.priority as (typeof validPriorities)[number])
      : undefined;

  if (req.query.status && !status) {
    return res.status(400).json({
      success: false,
      message: "Invalid task status",
      allowedValues: validStatuses,
    });
  }

  if (req.query.priority && !priority) {
    return res.status(400).json({
      success: false,
      message: "Invalid task priority",
      allowedValues: validPriorities,
    });
  }

  try {
    const tasks = await tasksService.getTasks(userId, {
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
}


export async function getOne(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const taskId = req.params.id as string;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const task = await tasksService.getTaskById(userId, taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
}

export async function update(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const taskId = req.params.id as string;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const parsed = updateTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid task data",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const task = await tasksService.updateTask(
      userId,
      taskId,
      parsed.data
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
}

export async function remove(req: Request, res: Response) {
  const userId = (req as AuthRequest).userId;
  const taskId = req.params.id as string;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const deleted = await tasksService.deleteTask(userId, taskId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
}
