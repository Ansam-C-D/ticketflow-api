import { validate } from '../../middleware/validation.middleware.js';
import { ticketIdParamSchema } from '../tickets/ticket.schemas.js';
import { commentController } from './comments.controller.js';
import { Router } from 'express';
import { createCommentSchema } from './comments.schemas.js';

export const commentRoutes = Router({ mergeParams: true });

/**
 * @openapi
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *     requestBody:
 *        description: Create comment path description
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             required: body
 *             properties:
 *               body: {type: string}
 *     responses:
 *       201:
 *         description: Comment created
 *   get:
 *     summary: List comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Comment List
 *
 */

commentRoutes.post(
  '/',
  validate({ params: ticketIdParamSchema, body: createCommentSchema }),
  (req, res, next) => {
    commentController.create(req, res).catch(next);
  }
);

commentRoutes.get('/', (req, res, next) => {
  commentController.list(req, res).catch(next);
});
