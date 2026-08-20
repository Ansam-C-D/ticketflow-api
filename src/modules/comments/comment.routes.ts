import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createCommentSchema,
  listCommentsQuerySchema
} from './comment.schema.js';
import { commentController } from './comment.controller.js';
import { ticketIdParamSchema } from '../tickets/ticket.schemas.js';

export const commentRoutes = Router({ mergeParams: true });
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
  validate({ params: ticketIdParamSchema, query: listCommentsQuerySchema }),
  (req, res, next) => {
    commentController.list(req, res).catch(next);
  }
);
