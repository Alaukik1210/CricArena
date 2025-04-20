/*
  Warnings:

  - You are about to drop the column `achievements` on the `OwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `groundCapacity` on the `OwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `groundLocation` on the `OwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `groundName` on the `OwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `groundStats` on the `OwnerProfile` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `OwnerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OwnerProfile" DROP COLUMN "achievements",
DROP COLUMN "groundCapacity",
DROP COLUMN "groundLocation",
DROP COLUMN "groundName",
DROP COLUMN "groundStats",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Ground" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "bookings" INTEGER NOT NULL DEFAULT 0,
    "pitchType" TEXT NOT NULL,
    "facilities" TEXT[],
    "pricePerMatch" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ground_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ground" ADD CONSTRAINT "Ground_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "OwnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
