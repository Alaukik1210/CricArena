-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Tournament', 'Training', 'League');

-- CreateTable
CREATE TABLE "TornamentDetails" (
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

    CONSTRAINT "TornamentDetails_pkey" PRIMARY KEY ("id")
);
