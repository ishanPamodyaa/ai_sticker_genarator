-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('SAMPLE', 'GENERATED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "TemplateStatus" NOT NULL,
    "provider" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "negativePrompt" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "configJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL,
    "type" "ImageType" NOT NULL,
    "templateId" TEXT NOT NULL,
    "sourceSampleId" TEXT,
    "promptUsed" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "seed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationJob" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "templateId" TEXT,
    "imageId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
