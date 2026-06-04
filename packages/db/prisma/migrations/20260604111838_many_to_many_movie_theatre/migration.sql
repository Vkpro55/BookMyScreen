-- CreateTable
CREATE TABLE "movie_theaters" (
    "movieId" TEXT NOT NULL,
    "theaterId" TEXT NOT NULL,

    CONSTRAINT "movie_theaters_pkey" PRIMARY KEY ("movieId","theaterId")
);

-- CreateTable
CREATE TABLE "_MovieTheaters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieTheaters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieTheaters_B_index" ON "_MovieTheaters"("B");

-- AddForeignKey
ALTER TABLE "movie_theaters" ADD CONSTRAINT "movie_theaters_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_theaters" ADD CONSTRAINT "movie_theaters_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "theaters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieTheaters" ADD CONSTRAINT "_MovieTheaters_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieTheaters" ADD CONSTRAINT "_MovieTheaters_B_fkey" FOREIGN KEY ("B") REFERENCES "theaters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
