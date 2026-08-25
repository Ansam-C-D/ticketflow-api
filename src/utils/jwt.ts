import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../config/env.ts';
import type { AuthUser } from '../types/auth.ts';

type JwtPayload = AuthUser & jwt.JwtPayload;

export function signToken(payload: { userId: string; role: Role }): string {
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as unknown as NonNullable<
      jwt.SignOptions['expiresIn']
    >
  });
}

export function verifyToken(token: string): AuthUser {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

  return {
    userId: decoded.userId,
    role: decoded.role
  };
}
