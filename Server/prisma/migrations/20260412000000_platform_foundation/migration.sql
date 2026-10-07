-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('CRICKET');

-- CreateEnum
CREATE TYPE "TournamentLifecycleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GroundLifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BookingSessionStatus" AS ENUM ('DRAFT', 'PAYMENT_PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentRecordStatus" AS ENUM ('REQUIRES_ACTION', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('CASUAL', 'TEAM_JOIN', 'TEAM_BUILD', 'TRAINING', 'ANY');

-- CreateEnum
CREATE TYPE "PlayRoomStatus" AS ENUM ('OPEN', 'FULL', 'MATCHING', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlayRoomTeamMode" AS ENUM ('SINGLE_GROUP', 'TWO_TEAMS', 'OPEN_PRACTICE');

-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContactMode" AS ENUM ('IN_APP', 'WHATSAPP_CONSENT', 'PHONE_CONSENT');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Ground" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "status" "GroundLifecycleStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "primaryRole" TEXT,
ADD COLUMN     "skillLevel" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "captainUserId" TEXT,
ADD COLUMN     "managerUserId" TEXT;

-- AlterTable
ALTER TABLE "TournamentDetails" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "entryFeeAmount" INTEGER,
ADD COLUMN     "registrationClosesAt" TIMESTAMP(3),
ADD COLUMN     "startsAt" TIMESTAMP(3),
ADD COLUMN     "status" "TournamentLifecycleStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneE164" TEXT;

-- CreateTable
CREATE TABLE "GroundSlot" (
    "id" TEXT NOT NULL,
    "groundId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'inr',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroundSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groundId" TEXT NOT NULL,
    "slotId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'inr',
    "status" "BookingSessionStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "paymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groundId" TEXT NOT NULL,
    "slotId" TEXT,
    "bookingSessionId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'inr',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bookingId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'inr',
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "providerPaymentId" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "status" "PaymentRecordStatus" NOT NULL DEFAULT 'REQUIRES_ACTION',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerAvailability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sport" "SportType" NOT NULL DEFAULT 'CRICKET',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availabilityType" "AvailabilityType" NOT NULL DEFAULT 'CASUAL',
    "skillLevel" TEXT,
    "preferredRoles" TEXT[],
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "radiusKm" INTEGER NOT NULL DEFAULT 10,
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayRoom" (
    "id" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "sport" "SportType" NOT NULL DEFAULT 'CRICKET',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PlayRoomStatus" NOT NULL DEFAULT 'OPEN',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "radiusKm" INTEGER NOT NULL DEFAULT 10,
    "requiredPlayers" INTEGER NOT NULL DEFAULT 10,
    "currentPlayers" INTEGER NOT NULL DEFAULT 1,
    "teamMode" "PlayRoomTeamMode" NOT NULL DEFAULT 'SINGLE_GROUP',
    "skillLevel" TEXT,
    "city" TEXT,
    "state" TEXT,
    "matchDate" TIMESTAMP(3),
    "contactMode" "ContactMode" NOT NULL DEFAULT 'IN_APP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayRoomMember" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rolePreference" TEXT,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayRoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayRoomJoinRequest" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "message" TEXT,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayRoomJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingSession_paymentIntentId_key" ON "BookingSession"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingSessionId_key" ON "Booking"("bookingSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecord_providerPaymentId_key" ON "PaymentRecord"("providerPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecord_paymentIntentId_key" ON "PaymentRecord"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayRoomMember_roomId_userId_key" ON "PlayRoomMember"("roomId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayRoomJoinRequest_roomId_requesterUserId_key" ON "PlayRoomJoinRequest"("roomId", "requesterUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneE164_key" ON "User"("phoneE164");

-- AddForeignKey
ALTER TABLE "GroundSlot" ADD CONSTRAINT "GroundSlot_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSession" ADD CONSTRAINT "BookingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSession" ADD CONSTRAINT "BookingSession_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSession" ADD CONSTRAINT "BookingSession_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "GroundSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "GroundSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bookingSessionId_fkey" FOREIGN KEY ("bookingSessionId") REFERENCES "BookingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerAvailability" ADD CONSTRAINT "PlayerAvailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayRoom" ADD CONSTRAINT "PlayRoom_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayRoomMember" ADD CONSTRAINT "PlayRoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "PlayRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayRoomMember" ADD CONSTRAINT "PlayRoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayRoomJoinRequest" ADD CONSTRAINT "PlayRoomJoinRequest_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "PlayRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayRoomJoinRequest" ADD CONSTRAINT "PlayRoomJoinRequest_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
