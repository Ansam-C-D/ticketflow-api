import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { commentController } from './comment.controller';
import { createCommentSchema, ticketIdParamSchema } from './comment.schemas';

export const commentRoutes = Router();

commentRoutes.use(requireAuth);

commentRoutes.post(
  '/:ticketId/comments',
  validate({
    params: ticketIdParamSchema,
    body: createCommentSchema
  }),
  (req, res, next) => {
    commentController.create(req, res).catch(next);
  }
);

commentRoutes.get(
  '/:ticketId/comments',
  validate({
    params: ticketIdParamSchema
  }),
  (req, res, next) => {
    commentController.list(req, res).catch(next);
  }
);
