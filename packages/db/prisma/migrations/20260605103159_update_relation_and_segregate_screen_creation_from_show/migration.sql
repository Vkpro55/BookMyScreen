/*
  Warnings:

  - The `format` column on the `movies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `rows` table. All the data in the column will be lost.
  - You are about to drop the column `row` on the `rows` table. All the data in the column will be lost.
  - You are about to drop the column `showId` on the `rows` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rows` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `shows` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `shows` table. All the data in the column will be lost.
  - You are about to drop the column `priceMap` on the `shows` table. All the data in the column will be lost.
  - You are about to drop the column `theaterId` on the `shows` table. All the data in the column will be lost.
  - You are about to drop the `movie_theaters` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[screenId,label]` on the table `rows` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `duration` on the `movies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `label` to the `rows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenId` to the `rows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenId` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "movie_theaters" DROP CONSTRAINT "movie_theaters_movieId_fkey";

-- DropForeignKey
ALTER TABLE "movie_theaters" DROP CONSTRAINT "movie_theaters_theaterId_fkey";

-- DropForeignKey
ALTER TABLE "rows" DROP CONSTRAINT "rows_showId_fkey";

-- DropForeignKey
ALTER TABLE "shows" DROP CONSTRAINT "shows_theaterId_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL,
DROP COLUMN "format",
ADD COLUMN     "format" "Format";

-- AlterTable
ALTER TABLE "rows" DROP COLUMN "createdAt",
DROP COLUMN "row",
DROP COLUMN "showId",
DROP COLUMN "updatedAt",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "screenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "seats" DROP COLUMN "createdAt",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "shows" DROP COLUMN "date",
DROP COLUMN "location",
DROP COLUMN "priceMap",
DROP COLUMN "theaterId",
ADD COLUMN     "screenId" TEXT NOT NULL;

-- DropTable
DROP TABLE "movie_theaters";

-- CreateTable
CREATE TABLE "screens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theaterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_seats" (
    "id" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "show_seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "show_seats_showId_seatId_key" ON "show_seats"("showId", "seatId");

-- CreateIndex
CREATE UNIQUE INDEX "rows_screenId_label_key" ON "rows"("screenId", "label");

-- CreateIndex
CREATE INDEX "shows_movieId_idx" ON "shows"("movieId");

-- CreateIndex
CREATE INDEX "shows_screenId_idx" ON "shows"("screenId");

-- CreateIndex
CREATE INDEX "shows_startTime_idx" ON "shows"("startTime");

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "theaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rows" ADD CONSTRAINT "rows_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_seats" ADD CONSTRAINT "show_seats_showId_fkey" FOREIGN KEY ("showId") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_seats" ADD CONSTRAINT "show_seats_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
