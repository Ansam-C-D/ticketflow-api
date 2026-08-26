import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth.ts';
import type { LoginInput, RegisterInput } from './auth.schemas.ts';
import { AuthService } from './auth.service.ts';

const authService = new AuthService();

export class AuthController {
  async register(request: Request, response: Response) {
    const result = await authService.register(request.body as RegisterInput);
    response.status(201).json({ data: result });
  }

  async login(request: Request, response: Response) {
    const result = await authService.login(request.body as LoginInput);
    response.json({ data: result });
  }

  async me(request: Request, response: Response) {
    const authRequest = request as AuthenticatedRequest;
    const user = await authService.getCurrentUser(authRequest.user!.userId);
    response.json({ data: user });
  }
}

export const authController = new AuthController();
