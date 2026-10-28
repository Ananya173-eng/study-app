
import prisma from "../../config/prisma.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "./tasks.validation.js";

export async function createTask(
  userId: string,
  input: CreateTaskInput
) {
  const { deadline, ...taskData } = input;

  return prisma.task.create({
    data: {
      ...taskData,
      deadline: deadline ? new Date(deadline) : null,
      userId,
    },
  });
}

export async function getTasks(
  userId: string,
  filters: {
    status?: "TODO" | "IN_PROGRESS" | "COMPLETED";
    priority?: "LOW" | "MEDIUM" | "HIGH";
  } = {}
) {
  return prisma.task.findMany({
    where: {
      userId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getTaskById(
  userId: string,
  taskId: string
) {
  return prisma.task.findFirst({
    where: { id: taskId, userId },
  });
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput
) {
  const { deadline, ...taskData } = input;

  const data = {
    ...taskData,
    ...(deadline !== undefined
      ? { deadline: deadline ? new Date(deadline) : null }
      : {}),
  };

  const result = await prisma.task.updateMany({
    where: { id: taskId, userId },
    data,
  });

  if (result.count === 0) return null;

  return getTaskById(userId, taskId);
}

export async function deleteTask(userId: string, taskId: string) {
  const result = await prisma.task.deleteMany({
    where: { id: taskId, userId },
  });

  return result.count > 0;
}
