import type { Request, Response } from 'express';
import { UserService } from './user.service.ts';

const userService = new UserService();

export class UserController {
  async list(request: Request, response: Response) {
    const users = await userService.listUsers(request.query);
    response.json({ data: users });
  }
}

export const userController = new UserController();
