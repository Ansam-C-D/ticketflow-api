import { z } from 'zod';

export const CreateComment = z.object({
  ticketId: z.string(),
  body: z.string()
});

export type CreateComment = z.infer<typeof CreateComment>;
