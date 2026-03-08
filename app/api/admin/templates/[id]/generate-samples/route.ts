import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/admin/templates/[id]/generate-samples — create sample batch job
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const job = await prisma.generationJob.create({
    data: {
      jobType: "SAMPLE_BATCH",
      templateId: template.id,
      requestedById: session.user.id,
      payloadJson: {
        basePrompt: template.basePrompt,
        negativePrompt: template.negativePrompt,
        width: template.width,
        height: template.height,
        sampleCount: template.sampleCount,
        provider: template.provider,
        modelName: template.modelName,
      },
    },
  });

  // Worker will pick up the QUEUED job
  return NextResponse.json({ data: { jobId: job.id } }, { status: 201 });
}
