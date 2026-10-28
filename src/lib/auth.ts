import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'ai-study-hub-super-secure-jwt-secret-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

/**
 * Hash a plain password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password against a bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT token for an authenticated user
 */
export function signToken(payload: { userId: string; email: string; name?: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract authenticated user session from NextRequest headers or cookies
 */
export function getAuthenticatedUser(req: NextRequest): TokenPayload | null {
  try {
    // 1. Check Authorization header: Bearer <token>
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const payload = verifyToken(token);
      if (payload) return payload;
    }

    // 2. Check cookies
    const cookieToken = req.cookies.get('token')?.value;
    if (cookieToken) {
      const payload = verifyToken(cookieToken);
      if (payload) return payload;
    }

    // 3. Optional header for custom client requests
    const customHeader = req.headers.get('x-auth-token');
    if (customHeader) {
      const payload = verifyToken(customHeader);
      if (payload) return payload;
    }

    return null;
  } catch {
    return null;
  }
}
