import { TicketStatus } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { isValidStatusTransition } from '../../src/modules/tickets/ticket.service.ts';

describe('ticket status transition rules', () => {
  it('allows configured forward and reopen transitions', () => {
    expect(
      isValidStatusTransition(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
    ).toBe(true);
    expect(
      isValidStatusTransition(TicketStatus.OPEN, TicketStatus.CLOSED)
    ).toBe(true);
    expect(
      isValidStatusTransition(TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED)
    ).toBe(true);
    expect(
      isValidStatusTransition(TicketStatus.CLOSED, TicketStatus.OPEN)
    ).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(
      isValidStatusTransition(TicketStatus.OPEN, TicketStatus.RESOLVED)
    ).toBe(false);
    expect(
      isValidStatusTransition(TicketStatus.RESOLVED, TicketStatus.OPEN)
    ).toBe(false);
  });
});
