import { z } from 'zod';
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number()
});

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20))
});

export type PaginationType = z.infer<typeof paginationSchema>;
