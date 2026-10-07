-- CreateTable
CREATE TABLE "GroundBooking" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "groundId" TEXT NOT NULL,
    "userId" TEXT,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroundBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroundBooking_paymentIntentId_key" ON "GroundBooking"("paymentIntentId");

-- AddForeignKey
ALTER TABLE "GroundBooking" ADD CONSTRAINT "GroundBooking_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES "Ground"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundBooking" ADD CONSTRAINT "GroundBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
