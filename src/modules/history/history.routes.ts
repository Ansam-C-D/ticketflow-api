import { type Request, type Response,type NextFunction, Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.ts';
import { validate } from '../../middleware/validation.middleware.ts';
import { paginationQuerySchema } from './history.schemas.ts';
import { historyController } from './history.controller.ts';

export const ticketRoutes = Router();
export const history = new historyController();

ticketRoutes.get(
  '/:ticketId/status-history',
  requireAuth,
  validate({ query: paginationQuerySchema }),
  (req: Request, res: Response, next: NextFunction) => {
    history.ticketHistory(req, res).catch(next);
  }
);
