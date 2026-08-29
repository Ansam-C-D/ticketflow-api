-- DropForeignKey
ALTER TABLE "TicketStatusHistory" DROP CONSTRAINT "TicketStatusHistory_changedBy_fkey";

-- DropForeignKey
ALTER TABLE "TicketStatusHistory" DROP CONSTRAINT "TicketStatusHistory_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "TicketStatusHistory" ADD CONSTRAINT "TicketStatusHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketStatusHistory" ADD CONSTRAINT "TicketStatusHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
