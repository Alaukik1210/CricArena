/*
  Warnings:

  - You are about to drop the `TornamentDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TornamentDetails";

-- CreateTable
CREATE TABLE "TournamentDetails" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tourStartsDate" TEXT NOT NULL,
    "tourEndDate" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "entryFee" TEXT NOT NULL,
    "spots" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'Tournament',
    "lastRegistrationDate" TEXT NOT NULL,

    CONSTRAINT "TournamentDetails_pkey" PRIMARY KEY ("id")
);
