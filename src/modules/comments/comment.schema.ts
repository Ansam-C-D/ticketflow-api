import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().trim().min(4).max(300)
});
export const listCommentQuerySchema = {
  ticketId: z.string()
};
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentQuerySchema>;
