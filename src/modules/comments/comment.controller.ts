import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../types/auth';
import { ListCommentsQuery } from './comment.schemas';
import type { CreateComment } from './comment.schemas';
import { GetCommentsQuery } from './comment.schemas';
import { CommentService } from './comment.service';
// import { BadRequestError } from '../../utils/errors';

const commentService = new CommentService();

function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}

export class CommentController {
  async create(request: Request, response: Response) {
    const cc: CreateComment = {
      body: request.body as string,
      ticketId: request.params.ticketId as string
    };
    // CreateComment.parse(cc)
    const comment = await commentService.createComment(authUser(request), cc);

    response.status(201).json({ data: comment });
  }
  async list(request: Request, response: Response) {
    const query: ListCommentsQuery = ListCommentsQuery.parse(request.query);
    const result = await commentService.listComments(authUser(request), query);
    response.json(result);
  }

  async getComments(request: Request, reponse: Response) {
    console.log('PArams', request);
    const params: GetCommentsQuery = GetCommentsQuery.parse(request.params);
    const tickets = await commentService.getComments(authUser(request), params);
    reponse.json(tickets);
  }
}

export const commentController = new CommentController();
