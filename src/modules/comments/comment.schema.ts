import { z } from 'zod';
import { paginationQuerySchema } from '../tickets/ticket.schemas.js';

export const createCommentSchema = z.object({
  body: z.string().min(10).max(5000)
});

export const listCommentsQuerySchema = paginationQuerySchema.extend({
  authorId: z.string().min(1).optional()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;
