import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/providers";
import { getStorage } from "@/lib/storage";

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

    const result = await provider.generate({
      prompt: job.template.prompt,
      negativePrompt: job.template.negativePrompt ?? undefined,
      width: job.template.width,
      height: job.template.height,
      sampleCount,
      configJson: (job.template.configJson as Record<string, unknown>) ?? undefined,
    });

    const imageIds: string[] = [];

    for (const img of result.images) {
      const imageId = randomUUID();
      const storagePath = `${job.templateId}/${imageId}.png`;

      await storage.save(img.imageBuffer, storagePath);

      await prisma.imageAsset.create({
        data: {
          id: imageId,
          type: isSampleBatch ? "SAMPLE" : "GENERATED",
          templateId: job.templateId,
          sourceSampleId: job.sampleId ?? null,
          createdById: job.requestedById ?? null,
          provider: result.provider,
          modelName: result.modelName,
          promptUsed: job.template.prompt,
          negativePromptUsed: job.template.negativePrompt,
          seed: img.seed ?? null,
          settingsJson: (img.metadata as Record<string, string>) ?? undefined,
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
