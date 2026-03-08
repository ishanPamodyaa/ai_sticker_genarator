import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/providers";
import { getStorage } from "@/lib/storage";
import { buildFullPrompt } from "@/lib/utils";

export async function processJob(jobId: string): Promise<void> {
  const job = await prisma.generationJob.findUniqueOrThrow({
    where: { id: jobId },
    include: { template: true },
  });

  await prisma.generationJob.update({
    where: { id: jobId },
    data: { status: "RUNNING" },
  });

  try {
    const provider = getProvider(job.template.provider, job.template.modelName);
    const storage = getStorage();

    const isSampleBatch = job.jobType === "SAMPLE_BATCH";
    const sampleCount = isSampleBatch ? job.template.sampleCount : 1;

    // Build the prompt: for samples use basePrompt directly,
    // for client generation prepend basePrompt + subject
    const prompt = isSampleBatch
      ? job.template.basePrompt
      : job.subjectPrompt
        ? buildFullPrompt(job.template.basePrompt, job.subjectPrompt)
        : job.template.basePrompt;

    const result = await provider.generate({
      prompt,
      negativePrompt: job.template.negativePrompt ?? undefined,
      width: job.template.width,
      height: job.template.height,
      sampleCount,
    });

    const imageIds: string[] = [];

    for (const img of result.images) {
      const imageId = randomUUID();
      const storagePath = `${job.templateId}/${imageId}.png`;

      await storage.save(img.imageBuffer, storagePath);

      await prisma.generatedImage.create({
        data: {
          id: imageId,
          type: isSampleBatch ? "SAMPLE" : "GENERATED",
          templateId: job.templateId,
          sourceSampleId: job.sampleId ?? null,
          createdById: job.requestedById ?? null,
          subjectPrompt: job.subjectPrompt ?? null,
          fullPromptUsed: prompt,
          provider: result.provider,
          modelName: result.modelName,
          seed: img.seed ?? null,
          width: job.template.width,
          height: job.template.height,
          gcsPath: storagePath,
        },
      });

      imageIds.push(imageId);
    }

    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "SUCCESS",
        resultImageId: imageIds[0] ?? null,
      },
    });
  } catch (error) {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
