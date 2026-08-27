import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { statusHistoryController } from './status-history.controller';
import { ticketIdParamSchema } from './status-history.schemas';

export const statusHistoryRoutes = Router();

statusHistoryRoutes.use(requireAuth);

statusHistoryRoutes.get(
  '/:ticketId/status-history',
  validate({ params: ticketIdParamSchema }),
  (req, res, next) => {
    statusHistoryController.list(req, res).catch(next);
  }
);
