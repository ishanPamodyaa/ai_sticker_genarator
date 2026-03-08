import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";
import { getStorage } from "@/lib/storage";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/templates/[id] — template detail with samples + recent jobs
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const storage = getStorage();

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      images: {
        where: { type: "SAMPLE", status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      },
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Add signed URLs to sample images
  const imagesWithUrls = await Promise.all(
    template.images.map(async (img) => ({
      ...img,
      imageUrl: await storage.getSignedUrl(img.gcsPath),
    }))
  );

  return NextResponse.json({
    data: { ...template, images: imagesWithUrls },
  });
}

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  provider: z.string().min(1).optional(),
  modelName: z.string().min(1).optional(),
  basePrompt: z.string().min(1).max(5000).optional(),
  negativePrompt: z.string().max(2000).optional(),
  width: z.number().int().min(256).max(2048).optional(),
  height: z.number().int().min(256).max(2048).optional(),
  sampleCount: z.number().int().min(1).max(20).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "DISABLED"]).optional(),
  tags: z.array(z.string()).optional(),
});

// PUT /api/admin/templates/[id] — update template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const { description, negativePrompt, ...rest } = parsed.data;
  const template = await prisma.template.update({
    where: { id },
    data: {
      ...rest,
      ...(description !== undefined && { description: description || null }),
      ...(negativePrompt !== undefined && {
        negativePrompt: negativePrompt || null,
      }),
    },
  });

  return NextResponse.json({ data: template });
}

// DELETE /api/admin/templates/[id] — delete template (cascades via schema)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Delete related records first (jobs don't cascade automatically)
  await prisma.generationJob.deleteMany({ where: { templateId: id } });
  await prisma.template.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
