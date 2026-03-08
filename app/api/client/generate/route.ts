import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkDailyRateLimit } from "@/lib/rate-limit";
import { z } from "zod/v4";

const generateSchema = z.object({
  sampleId: z.string().uuid(),
  subjectPrompt: z.string().min(1, "Subject is required").max(500),
});

// POST /api/client/generate — create a generation job from a sample
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check daily rate limit
  const rateCheck = await checkDailyRateLimit(session.user.id);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Daily generation limit reached (${rateCheck.remaining} remaining). Try again tomorrow.`,
      },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = generateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { sampleId, subjectPrompt } = parsed.data;

  // Find the sample and its template
  const sample = await prisma.generatedImage.findUnique({
    where: { id: sampleId, type: "SAMPLE", status: "ACTIVE" },
    include: { template: true },
  });

  if (!sample) {
    return NextResponse.json(
      { error: "Sample not found" },
      { status: 404 }
    );
  }

  if (sample.template.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Template is not active" },
      { status: 400 }
    );
  }

  const job = await prisma.generationJob.create({
    data: {
      jobType: "CLIENT_GENERATION",
      templateId: sample.templateId,
      sampleId: sample.id,
      requestedById: session.user.id,
      subjectPrompt,
      payloadJson: {
        basePrompt: sample.template.basePrompt,
        negativePrompt: sample.template.negativePrompt,
        width: sample.template.width,
        height: sample.template.height,
        sampleCount: 1,
        provider: sample.template.provider,
        modelName: sample.template.modelName,
        sourceSampleId: sample.id,
        subjectPrompt,
      },
    },
  });

  // Worker will pick up the QUEUED job
  return NextResponse.json(
    { data: { jobId: job.id, remaining: rateCheck.remaining - 1 } },
    { status: 201 }
  );
}
