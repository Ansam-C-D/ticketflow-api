import { z } from 'zod';
import { paginationQuerySchema } from '../tickets/ticket.schemas';

export const CreateComment = z.object({
  ticketId: z.string(),
  body: z.string()
});

export const ListCommentsFilters = z.object({
  ticketId: z.string().optional(),
  search: z.string().optional()
});

export const ListCommentsQuery = paginationQuerySchema.extend(
  ListCommentsFilters.shape
);

export type CreateComment = z.infer<typeof CreateComment>;
export type ListCommentsQuery = z.infer<typeof ListCommentsQuery>;
export type ListCommentsFilters = z.infer<typeof ListCommentsFilters>;
