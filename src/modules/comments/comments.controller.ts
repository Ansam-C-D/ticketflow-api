import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth.ts';
import type {
  CreateCommentInput,
  ListCommentsQuery
} from './comments.schema.ts';
import { CommentService } from './comments.service.ts';

const commentService = new CommentService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class CommentController {
  async create(request: Request, response: Response) {
    const comment = await commentService.createComment(
      authUser(request),
      String(request.params.id),
      request.body as CreateCommentInput
    );
    response.status(201).json({ data: comment });
  }
  async list(request: Request, response: Response) {
    const result = await commentService.listComments(
      authUser(request),
      String(request.params.id),
      request.query as unknown as ListCommentsQuery
    );
    response.status(200).json({ data: result });
  }
}
