import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { ticketIdParamSchema } from '../tickets/ticket.schemas.js';
import { listHistoryQuerySchema } from './history.schema.js';
import { historyController } from './history.controller.js';

export const historyRoutes = Router({ mergeParams: true });

historyRoutes.use(requireAuth);
historyRoutes.get(
  '/',
  validate({
    params: ticketIdParamSchema,
    query: listHistoryQuerySchema
  }),
  (req, res, next) => {
    historyController.list(req, res).catch(next);
  }
);
