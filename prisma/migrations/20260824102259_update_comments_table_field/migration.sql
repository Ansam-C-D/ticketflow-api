/*
  Warnings:

  - You are about to drop the column `commentedById` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `commentedOnId` on the `Comments` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_commentedById_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_commentedOnId_fkey";

-- DropIndex
DROP INDEX "Comments_commentedById_idx";

-- DropIndex
DROP INDEX "Comments_commentedOnId_idx";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "commentedById",
DROP COLUMN "commentedOnId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "ticketId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Comments_authorId_idx" ON "Comments"("authorId");

-- CreateIndex
CREATE INDEX "Comments_ticketId_idx" ON "Comments"("ticketId");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
