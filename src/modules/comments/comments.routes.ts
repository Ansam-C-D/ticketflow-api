import { validate } from '../../middleware/validation.middleware.ts';
import { createCommentSchema } from './comments.schemas.ts';
import { CommentController } from './comments.controller.ts';
import { Router } from 'express';

const commentController = new CommentController();

export const ticketRoutes = Router();

/**
 * @openapi
 * /api/tickets:
 *   post:
 *     summary: Create a comment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Comment created
 *   get:
 *     summary: List comments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: comment list
 */
ticketRoutes.post(
  '/:ticketId/comments',
  validate({ body: createCommentSchema }),
  (req, res, next) => {
    commentController.create(req, res).catch(next);
  }
);

ticketRoutes.get(
  '/:ticketId/comments',
  (req, res, next) => {
    commentController.getById(req, res).catch(next);
  }
);

/**
 * @openapi
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by id
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket found
 *   patch:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ticket updated
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ticket deleted
 */
