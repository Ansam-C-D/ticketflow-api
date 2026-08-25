/*
  Warnings:

  - You are about to drop the column `history` on the `StatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StatusHistory` table. All the data in the column will be lost.
  - Added the required column `fromStatus` to the `StatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toStatus` to the `StatusHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StatusHistory" DROP COLUMN "history",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fromStatus" TEXT NOT NULL,
ADD COLUMN     "toStatus" TEXT NOT NULL;
