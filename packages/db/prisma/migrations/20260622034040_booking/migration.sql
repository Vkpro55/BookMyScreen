-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "bookingRef" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "seats" TEXT[],
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "bookingDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentOrderId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_fees" (
    "id" TEXT NOT NULL,
    "ticketPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "convenience" DOUBLE PRECISION NOT NULL,
    "bookingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingRef_key" ON "bookings"("bookingRef");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_paymentOrderId_key" ON "bookings"("paymentOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_fees_bookingId_key" ON "booking_fees"("bookingId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_showId_fkey" FOREIGN KEY ("showId") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "payment_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_fees" ADD CONSTRAINT "booking_fees_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
