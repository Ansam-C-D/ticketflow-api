import express from 'express';
import { requireAuth } from '../../middleware/auth.middleware.ts';
import { validate } from '../../middleware/validation.middleware.ts';
import { CommentController } from './comments.controller.ts';
import { ticketIdParamSchema } from '../tickets/ticket.schemas.ts';
import {
  createCommentSchema,
  listCommentsQuerySchema
} from './comments.schema.ts';

const commentController = new CommentController();
export const commentRoutes = express.Router({ mergeParams: true });
commentRoutes.use(requireAuth);

commentRoutes.post(
  '/',
  validate({ params: ticketIdParamSchema, body: createCommentSchema }),
  (req, res, next) => {
    commentController.create(req, res).catch(next);
  }
);
commentRoutes.get(
  '/',
  validate({ params: ticketIdParamSchema }),
  (req, res, next) => {
    commentController.list(req, res).catch(next);
  }
);
