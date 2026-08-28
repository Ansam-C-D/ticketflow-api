import { z } from 'zod';

export const GetHistory = z.object({
  ticketId: z.string().optional()
});

export type GetHistory = z.infer<typeof GetHistory>;
