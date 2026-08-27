import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { CreateComment, ListCommentsQuery } from './comment.schemas.js';
import { commentController } from './comment.controller.js';

export const commentRoutes = Router();

commentRoutes.use(requireAuth);

/**
 * @openapi
 * /api/comments:
 *  post:
 *      summary: Creates a new comment to a post
 *      tags: [Comments]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: [ticketId, body]
 *                      properties:
 *                          ticketId: {type: string}
 *                          body: {type: string}
 *      security:
 *          -   bearerAuth: []
 *      reponses:
 *          201:
 *              description: Comment added
 */

commentRoutes.post('/', validate({ body: CreateComment }), (req, res, next) => {
  commentController.create(req, res).catch(next);
});

commentRoutes.get(
  '/',
  validate({ query: ListCommentsQuery }),
  (req, res, next) => {
    commentController.list(req, res).catch(next);
  }
);
