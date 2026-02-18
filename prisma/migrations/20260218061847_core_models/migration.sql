/*
  Warnings:

  - You are about to drop the column `imageId` on the `GenerationJob` table. All the data in the column will be lost.
  - You are about to drop the column `storageUrl` on the `ImageAsset` table. All the data in the column will be lost.
  - Added the required column `payloadJson` to the `GenerationJob` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `jobType` on the `GenerationJob` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `templateId` on table `GenerationJob` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `gcsPath` to the `ImageAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelName` to the `ImageAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `ImageAsset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('SAMPLE_BATCH', 'CLIENT_GENERATION');

-- AlterTable
ALTER TABLE "GenerationJob" DROP COLUMN "imageId",
ADD COLUMN     "payloadJson" JSONB NOT NULL,
ADD COLUMN     "requestedById" TEXT,
ADD COLUMN     "resultImageId" TEXT,
ADD COLUMN     "sampleId" TEXT,
DROP COLUMN "jobType",
ADD COLUMN     "jobType" "JobType" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'QUEUED',
ALTER COLUMN "templateId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ImageAsset" DROP COLUMN "storageUrl",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "gcsPath" TEXT NOT NULL,
ADD COLUMN     "modelName" TEXT NOT NULL,
ADD COLUMN     "negativePromptUsed" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "settingsJson" JSONB,
ADD COLUMN     "status" "ImageStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "thumbnailPath" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "sampleCount" SET DEFAULT 4;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_sourceSampleId_fkey" FOREIGN KEY ("sourceSampleId") REFERENCES "ImageAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "ImageAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
