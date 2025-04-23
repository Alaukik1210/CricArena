/*
  Warnings:

  - Added the required column `ownerId` to the `OwnerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OwnerProfile" ADD COLUMN     "ownerId" TEXT NOT NULL;
