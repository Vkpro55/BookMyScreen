/*
  Warnings:

  - You are about to drop the `_MovieTheaters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieTheaters" DROP CONSTRAINT "_MovieTheaters_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieTheaters" DROP CONSTRAINT "_MovieTheaters_B_fkey";

-- DropTable
DROP TABLE "_MovieTheaters";
