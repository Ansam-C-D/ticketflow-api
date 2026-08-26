import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { verifyToken } from '../utils/jwt.ts';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.ts';
import type { AuthenticatedRequest } from '../types/auth.ts';

export function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError();
    }

    const token = authHeader.replace('Bearer ', '');
    (request as AuthenticatedRequest).user = verifyToken(token);
    next();
  } catch {
    next(new UnauthorizedError());
  }
}

export function requireRole(roles: Role[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const authRequest = request as AuthenticatedRequest;

    if (!authRequest.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!roles.includes(authRequest.user.role)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}
