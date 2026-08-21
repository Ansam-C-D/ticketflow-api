import { TicketStatus } from '@prisma/client';
import { z } from 'zod';
import { paginationQuerySchema } from '../tickets/ticket.schemas.js';

export const createHistorySchema = z.object({
  fromStatus: z.nativeEnum(TicketStatus),
  toStatus: z.nativeEnum(TicketStatus).optional()
});

export const listHistoryQuerySchema = paginationQuerySchema.extend({
  changedById: z.string().min(1).optional()
});
export type CreateHistoryInput = z.infer<typeof createHistorySchema>;
export type ListHistoryQuery = z.infer<typeof listHistoryQuerySchema>;
