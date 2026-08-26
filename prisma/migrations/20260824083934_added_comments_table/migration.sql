-- CreateTable
CREATE TABLE "Comments" (
    "comment_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "commentedById" TEXT NOT NULL,
    "commentedOnId" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateIndex
CREATE INDEX "Comments_commentedById_idx" ON "Comments"("commentedById");

-- CreateIndex
CREATE INDEX "Comments_commentedOnId_idx" ON "Comments"("commentedOnId");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_commentedById_fkey" FOREIGN KEY ("commentedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_commentedOnId_fkey" FOREIGN KEY ("commentedOnId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
