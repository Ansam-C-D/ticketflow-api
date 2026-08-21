import { authUser } from '../../utils/permissions.js';
import type {
  CreateCommentInput,
  ListCommentsQuery
} from './comment.schema.js';
import { CommentService } from './comment.service.js';
import type { Request, Response } from 'express';
const commentService = new CommentService();

export class CommentController {
  async create(request: Request, response: Response) {
    const ticketId: string = request.params.id!.toString();
    const comment = await commentService.createComment(
      authUser(request),
      ticketId,
      request.body as CreateCommentInput
    );
    response.status(201).json({ data: comment });
  }
  async list(request: Request, response: Response) {
    const ticketId = request.params.id!.toString();
    const result = await commentService.listComments(
      authUser(request),
      ticketId,
      request.query as unknown as ListCommentsQuery
    );
    response.status(200).json(result);
  }
}
export const commentController = new CommentController();
