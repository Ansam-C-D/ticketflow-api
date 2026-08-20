-- CreateTable
CREATE TABLE "Status_History" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "fromStatus" "TicketStatus" NOT NULL,
    "toStatus" "TicketStatus" NOT NULL,
    "changedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Status_History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Status_History_ticketId_idx" ON "Status_History"("ticketId");

-- CreateIndex
CREATE INDEX "Status_History_changedById_idx" ON "Status_History"("changedById");

-- AddForeignKey
ALTER TABLE "Status_History" ADD CONSTRAINT "Status_History_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status_History" ADD CONSTRAINT "Status_History_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
