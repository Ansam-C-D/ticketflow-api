import { z } from 'zod';

export const historyOfTicket = z.object({
  ticketId: z.string(),
  history: z.array(z.string()),
  changeById: z.string()
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export type ticketHistory = z.Infer<typeof historyOfTicket>;
export type listHistoryInput = z.infer<typeof paginationQuerySchema>;
