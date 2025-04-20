-- CreateTable
CREATE TABLE "_TeamToTournamentDetails" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamToTournamentDetails_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamToTournamentDetails_B_index" ON "_TeamToTournamentDetails"("B");

-- AddForeignKey
ALTER TABLE "_TeamToTournamentDetails" ADD CONSTRAINT "_TeamToTournamentDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToTournamentDetails" ADD CONSTRAINT "_TeamToTournamentDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "TournamentDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
