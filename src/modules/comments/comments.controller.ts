import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth.ts';
import { commentservice } from './comments.services.ts';
import { type createCommentInput } from './comments.schemas.ts';


function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class CommentController {
  async create(request: Request, response: Response) {
    const ticket = await commentservice.createComment(
      authUser(request),
      request.body as createCommentInput,String(request.params.ticketId)
    );
    response.status(201).json({ data: ticket });
  }

  async getById(request: Request, response: Response) {
    const ticket = await commentservice.getCommentById(
      String(request.params.ticketId)
    );
    response.json({ data: ticket });
  }
}