
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

function createToken(userId: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }

  return jwt.sign({ sub: userId }, secret, { expiresIn: "1d" });
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw Object.assign(new Error("Email is already registered"), {
      statusCode: 409,
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return {
    user,
    token: createToken(user.id),
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token: createToken(user.id),
  };
}
