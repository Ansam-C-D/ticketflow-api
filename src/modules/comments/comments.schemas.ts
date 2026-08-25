import { z } from 'zod';

export const createCommentSchema = z.object({
  title: z.string().trim().min(3).max(120),
  commentBody: z.string().trim().min(10).max(5000),
});


export type createCommentInput = z.infer<typeof createCommentSchema>;
