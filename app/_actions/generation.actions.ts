"use server";

import { prisma } from "@/lib/prisma";
import { processJob } from "@/lib/jobs/processor";
import { after } from "next/server";

export async function generateSamples(
  templateId: string
): Promise<{ jobId: string }> {
  const template = await prisma.template.findUniqueOrThrow({
    where: { id: templateId },
  });

  const job = await prisma.generationJob.create({
    data: {
      jobType: "SAMPLE_BATCH",
      templateId: template.id,
      payloadJson: {
        prompt: template.prompt,
        negativePrompt: template.negativePrompt,
        width: template.width,
        height: template.height,
        sampleCount: template.sampleCount,
        provider: template.provider,
        modelName: template.modelName,
      },
    },
  });

  after(() => processJob(job.id));

  return { jobId: job.id };
}

export async function generateFromSample(
  sampleId: string
): Promise<{ jobId: string }> {
  const sample = await prisma.imageAsset.findUniqueOrThrow({
    where: { id: sampleId },
    include: { template: true },
  });

  const template = sample.template;

  const job = await prisma.generationJob.create({
    data: {
      jobType: "CLIENT_GENERATION",
      templateId: template.id,
      sampleId: sample.id,
      payloadJson: {
        prompt: template.prompt,
        negativePrompt: template.negativePrompt,
        width: template.width,
        height: template.height,
        sampleCount: 1,
        provider: template.provider,
        modelName: template.modelName,
        sourceSampleId: sample.id,
      },
    },
  });

  after(() => processJob(job.id));

  return { jobId: job.id };
}
