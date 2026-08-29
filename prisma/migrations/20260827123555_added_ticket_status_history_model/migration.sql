-- CreateTable
CREATE TABLE "TicketStatusHistory" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "fromStatus" "TicketStatus" NOT NULL,
    "toStatus" "TicketStatus" NOT NULL,
    "changedBy" TEXT NOT NULL,

    CONSTRAINT "TicketStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketStatusHistory" ADD CONSTRAINT "TicketStatusHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketStatusHistory" ADD CONSTRAINT "TicketStatusHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
