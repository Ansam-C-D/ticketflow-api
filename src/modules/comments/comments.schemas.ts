import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().min(1),
  ticketId: z.string().min(1).optional(),
  authorId: z.string().min(1).optional()
});

export const getCommentSchema = z.object({
  ticketId: z.string().min(1).optional(),
  authorId: z.string().min(1).optional()
});

export const ticketIdParamSchema = z.object({
  ticketId: z.string().min(1)
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
