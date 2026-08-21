import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().trim().min(3).max(5000)
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
