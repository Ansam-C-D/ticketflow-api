import { Role } from '@prisma/client';
import type { TicketWithRelations } from '../modules/tickets/ticket.repository';
import type { AuthenticatedRequest, AuthUser } from '../types/auth';
import type { Request } from 'express';

export function canViewTicket(user: AuthUser, ticket: TicketWithRelations) {
  if (user.role === Role.ADMIN || user.role === Role.AGENT) {
    return true;
  }

  return ticket.createdById === user.userId;
}
export function authUser(request: Request) {
  return (request as AuthenticatedRequest).user!;
}
