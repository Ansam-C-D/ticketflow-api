-- CreateTable
CREATE TABLE "Status_History" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "chnagedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Status_History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Status_History" ADD CONSTRAINT "Status_History_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status_History" ADD CONSTRAINT "Status_History_chnagedById_fkey" FOREIGN KEY ("chnagedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
