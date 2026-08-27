import { z } from 'zod';

export const ticketIdParamSchema = z.object({
  ticketId: z.string().min(1)
});
