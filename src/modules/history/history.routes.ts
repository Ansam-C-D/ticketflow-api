import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { historyController } from './history.controller.js';

export const historyRoutes = Router({ mergeParams: true });

historyRoutes.use(requireAuth);

historyRoutes.get('/', (req, res, next) => {
  historyController.getHistory(req, res).catch(next);
});
