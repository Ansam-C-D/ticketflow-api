import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.ts';
import { validate } from '../../middleware/validation.middleware.ts';
import { createCommentSchema } from './comment.schema.ts';
import { commentController } from './comment.controller.ts';

export const commentRoutes = Router({ mergeParams: true });

commentRoutes.use(requireAuth);

commentRoutes.post(
  '/',
  validate({ body: createCommentSchema }),
  (req, res, next) => {
    commentController.create(req, res).catch(next);
  }
);

commentRoutes.get('/', (req, res, next) => {
  commentController.list(req, res).catch(next);
});
