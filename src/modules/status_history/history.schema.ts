import { z } from 'zod';

export const listStatusHistoryQuerySchema = {
  ticketId: z.string()
};
export type ListStatusQuery = z.infer<typeof listStatusHistoryQuerySchema>;
