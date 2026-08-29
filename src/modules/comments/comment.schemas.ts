import { z } from 'zod';
import { paginationQuerySchema } from '../tickets/ticket.schemas';

export const CreateCommentRequestBody = z.object({
  body: z.string()
});
export const CreateComment = CreateCommentRequestBody.extend({
  ticketId: z.string()
});

export const ListCommentsFilters = z.object({
  ticketId: z.string().optional(),
  search: z.string().optional()
});

export const ListCommentsQuery = paginationQuerySchema.extend(
  ListCommentsFilters.shape
);

export const GetCommentsQuery = z.object({
  ticketId: z.string().optional()
});

export type CreateComment = z.infer<typeof CreateComment>;
export type CreateCommentRequestBody = z.infer<typeof CreateCommentRequestBody>;
export type ListCommentsQuery = z.infer<typeof ListCommentsQuery>;
export type ListCommentsFilters = z.infer<typeof ListCommentsFilters>;
export type GetCommentsQuery = z.infer<typeof GetCommentsQuery>;
