
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { loginUser, registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const data = await registerUser(result.data);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data,
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Request failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid login data",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const data = await loginUser(result.data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Internal server error"
          : error instanceof Error
            ? error.message
            : "Request failed",
    });
  }
}
