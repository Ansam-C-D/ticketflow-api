import { z } from 'zod';
import { paginationQuerySchema } from '../tickets/ticket.schemas';

export const createCommentSchema = z.object({
  body: z.string().trim().min(1, 'Comment body cannot be empty').max(300)
});
export const listCommentsQuerySchema = paginationQuerySchema;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;
