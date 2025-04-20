/*
  Warnings:

  - Made the column `skills` on table `PlayerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `battingStyle` on table `PlayerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bowlingStyle` on table `PlayerProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PlayerProfile" ALTER COLUMN "skills" SET NOT NULL,
ALTER COLUMN "battingStyle" SET NOT NULL,
ALTER COLUMN "bowlingStyle" SET NOT NULL;
