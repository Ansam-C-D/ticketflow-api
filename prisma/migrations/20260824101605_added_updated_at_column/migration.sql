/*
  Warnings:

  - You are about to drop the column `content` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Comments` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_createdById_fkey";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "content",
DROP COLUMN "createdById",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
