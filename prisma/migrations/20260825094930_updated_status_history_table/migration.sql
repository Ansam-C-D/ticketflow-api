/*
  Warnings:

  - You are about to drop the column `chnagedById` on the `Status_History` table. All the data in the column will be lost.
  - Added the required column `changedById` to the `Status_History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Status_History" DROP CONSTRAINT "Status_History_chnagedById_fkey";

-- AlterTable
ALTER TABLE "Status_History" DROP COLUMN "chnagedById",
ADD COLUMN     "changedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Status_History" ADD CONSTRAINT "Status_History_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
