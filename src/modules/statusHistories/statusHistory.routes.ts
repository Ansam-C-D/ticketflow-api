import { Router } from 'express';
import { validate } from '../../middleware/validation.middleware';
import { ticketIdParamSchema } from '../tickets/ticket.schemas';
import { statusHistoryController } from './statusHistory.controller';

export const statusHistoryRoutes = Router({ mergeParams: true });

/**
 * @openapi
 * /api/tickets/{id}/status-history:
 *   get:
 *     summary: List status history
 *     tags: [StatusHistory]
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
 *         description: Status History List
 *
 */

statusHistoryRoutes.get(
  '/',
  validate({ params: ticketIdParamSchema }),
  (req, res, next) => {
    statusHistoryController.list(req, res).catch(next);
  }
);
