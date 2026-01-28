-- AlterTable
ALTER TABLE "CognitiveTest" ADD COLUMN     "kind" TEXT;

-- CreateIndex
CREATE INDEX "CognitiveTest_userId_kind_idx" ON "CognitiveTest"("userId", "kind");

-- CreateIndex
CREATE INDEX "CognitiveTest_userId_createdAt_idx" ON "CognitiveTest"("userId", "createdAt");
