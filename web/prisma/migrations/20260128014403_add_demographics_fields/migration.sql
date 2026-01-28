-- AlterTable
ALTER TABLE "User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "demographicsCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "sex" TEXT;
