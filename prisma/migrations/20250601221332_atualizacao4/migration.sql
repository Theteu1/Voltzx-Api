/*
  Warnings:

  - Made the column `description` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Investment" ALTER COLUMN "description" SET NOT NULL;
