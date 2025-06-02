/*
  Warnings:

  - You are about to drop the column `documentId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `Investor` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `LandOwner` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'REJECTED';

-- DropIndex
DROP INDEX "Company_documentId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "documentId";

-- AlterTable
ALTER TABLE "Investor" DROP COLUMN "documentId";

-- AlterTable
ALTER TABLE "LandOwner" DROP COLUMN "documentId";
