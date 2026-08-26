import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.ts';
import { statusHistoryController } from './history.controller.ts';

export const statusHistoryRoutes = Router({ mergeParams: true });

statusHistoryRoutes.use(requireAuth);

statusHistoryRoutes.get('/', (req, res, next) => {
  statusHistoryController.list(req, res).catch(next);
});
