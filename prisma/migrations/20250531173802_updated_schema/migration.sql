/*
  Warnings:

  - The values [APPROVED] on the enum `InvestmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,PROPOSED,APPROVED,REJECTED] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `companyApproved` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `ownerApproved` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProjectProposal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Land` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedReturn` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `powerKw` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `landId` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cost` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "InvestmentStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "Investment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Investment" ALTER COLUMN "status" TYPE "InvestmentStatus_new" USING ("status"::text::"InvestmentStatus_new");
ALTER TYPE "InvestmentStatus" RENAME TO "InvestmentStatus_old";
ALTER TYPE "InvestmentStatus_new" RENAME TO "InvestmentStatus";
DROP TYPE "InvestmentStatus_old";
ALTER TABLE "Investment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'COMPLETED');
ALTER TABLE "Project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "status" TYPE "ProjectStatus_new" USING ("status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "ProjectStatus_old";
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';
COMMIT;

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_investorId_fkey";

-- DropForeignKey
ALTER TABLE "Land" DROP CONSTRAINT "Land_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_landId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectProposal" DROP CONSTRAINT "ProjectProposal_landId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectProposal" DROP CONSTRAINT "ProjectProposal_projectId_fkey";

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "amount",
DROP COLUMN "companyApproved",
DROP COLUMN "createdAt",
DROP COLUMN "ownerApproved",
DROP COLUMN "terms",
DROP COLUMN "updatedAt",
ADD COLUMN     "companyAgree" "AgreementStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "investedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerAgree" "AgreementStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Land" DROP COLUMN "coordinates",
DROP COLUMN "createdAt",
DROP COLUMN "location",
DROP COLUMN "price",
DROP COLUMN "size",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "estimatedReturn" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "powerKw" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "landId" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL',
ALTER COLUMN "cost" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "ProjectProposal";

-- DropEnum
DROP TYPE "LandStatus";

-- DropEnum
DROP TYPE "ProposalStatus";

-- CreateTable
CREATE TABLE "LandOwner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "LandOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandOwner_userId_key" ON "LandOwner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_documentId_key" ON "Company"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_userId_key" ON "Investor"("userId");

-- AddForeignKey
ALTER TABLE "LandOwner" ADD CONSTRAINT "LandOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "LandOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Land"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
