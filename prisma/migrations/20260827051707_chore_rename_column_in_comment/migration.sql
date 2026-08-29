/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("ticketId", "authorId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
