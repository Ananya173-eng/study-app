import prisma from "../../config/prisma.js";

export async function createMaterial(
  userId: string,
  input: {
    title: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    extractedText?: string | null;
  }
) {
  return prisma.studyMaterial.create({
    data: {
      ...input,
      userId,
    },
  });
}

export async function getMaterials(userId: string) {
  return prisma.studyMaterial.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      fileName: true,
      mimeType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getMaterialById(userId: string, id: string) {
  return prisma.studyMaterial.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function deleteMaterial(userId: string, id: string) {
  return prisma.studyMaterial.deleteMany({
    where: {
      id,
      userId,
    },
  });
}