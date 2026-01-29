-- CreateTable
CREATE TABLE "QuickCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "anxiety" INTEGER NOT NULL,
    "focus" INTEGER NOT NULL,
    "motivation" INTEGER NOT NULL,
    "stress" INTEGER NOT NULL,
    "sleep" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuickCheckIn_userId_submittedAt_idx" ON "QuickCheckIn"("userId", "submittedAt");

-- AddForeignKey
ALTER TABLE "QuickCheckIn" ADD CONSTRAINT "QuickCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
