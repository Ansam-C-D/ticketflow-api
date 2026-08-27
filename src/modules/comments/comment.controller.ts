import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
import { ListCommentsQuery } from './comment.schemas';
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
  async list(request: Request, response: Response) {
    const query: ListCommentsQuery = ListCommentsQuery.parse(request.query);
    const result = await commentService.listComments(authUser(request), query);
    response.json(result);
  }
}

export const commentController = new CommentController();
