import express from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { ticketIdParamSchema } from '../tickets/ticket.schemas';
import { StatusHistoryController } from './status.controller';

const statusHistoryController = new StatusHistoryController();
export const statusHistoryRoutes = express.Router({ mergeParams: true });

statusHistoryRoutes.use(requireAuth);

statusHistoryRoutes.get(
  '/',
  validate({ params: ticketIdParamSchema }),
  (req, res, next) => {
    statusHistoryController.list(req, res).catch(next);
  }
);
