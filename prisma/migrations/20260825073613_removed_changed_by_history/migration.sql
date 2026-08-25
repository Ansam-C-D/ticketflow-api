/*
  Warnings:

  - You are about to drop the column `changedById` on the `StatusHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StatusHistory" DROP CONSTRAINT "StatusHistory_changedById_fkey";

-- AlterTable
ALTER TABLE "StatusHistory" DROP COLUMN "changedById";
