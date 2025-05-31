/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('OWNER', 'COMPANY', 'INVESTOR');

-- CreateEnum
CREATE TYPE "LandStatus" AS ENUM ('AVAILABLE', 'IN_NEGOTIATION', 'OCCUPIED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PROPOSED', 'APPROVED', 'REJECTED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "type" "UserType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Land" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "status" "LandStatus" NOT NULL DEFAULT 'AVAILABLE',
    "coordinates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "landId" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProposal" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "landId" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "terms" TEXT,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING',
    "companyApproved" BOOLEAN NOT NULL DEFAULT false,
    "ownerApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Land"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProposal" ADD CONSTRAINT "ProjectProposal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProposal" ADD CONSTRAINT "ProjectProposal_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Land"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
