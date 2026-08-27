import { z } from 'zod';

export const ticketIdParamSchema = z.object({
  ticketId: z.string().min(1)
});

export const createCommentSchema = z.object({
  body: z.string().trim().min(1).max(5000)
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
