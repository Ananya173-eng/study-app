
import prisma from "../../config/prisma.js";

export async function getDashboardStats(userId: string) {
  const [
    totalNotes,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    upcomingDeadlines,
  ] = await Promise.all([
    prisma.note.count({
      where: { userId },
    }),

    prisma.task.count({
      where: { userId },
    }),

    prisma.task.count({
      where: { userId, status: "COMPLETED" },
    }),

    prisma.task.count({
      where: { userId, status: "IN_PROGRESS" },
    }),

    prisma.task.count({
      where: { userId, status: "TODO" },
    }),

    prisma.task.findMany({
      where: {
        userId,
        deadline: {
          gte: new Date(),
        },
        status: {
          not: "COMPLETED",
        },
      },
      orderBy: {
        deadline: "asc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        deadline: true,
        status: true,
        priority: true,
      },
    }),
  ]);

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    statistics: {
      totalNotes,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionPercentage,
    },
    upcomingDeadlines,
  };
}
