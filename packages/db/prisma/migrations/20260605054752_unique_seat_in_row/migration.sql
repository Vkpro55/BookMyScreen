/*
  Warnings:

  - A unique constraint covering the columns `[rowId,number]` on the table `seats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seats_rowId_number_key" ON "seats"("rowId", "number");
