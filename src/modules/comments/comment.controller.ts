import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
import type { CreateComment } from './comment.schemas';
import { CommentService } from './comment.service';

const commentService = new CommentService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class CommentController {
  async create(request: Request, response: Response) {
    const comment = await commentService.createComment(
      authUser(request),
      request.body as CreateComment
    );

    response.status(201).json({ data: comment });
  }
}

export const commentController = new CommentController();
