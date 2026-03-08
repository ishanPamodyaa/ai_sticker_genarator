import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/templates — list all templates with image counts
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { images: true, jobs: true } },
    },
  });

  return NextResponse.json({ data: templates });
}

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  provider: z.string().min(1, "Provider is required"),
  modelName: z.string().min(1, "Model name is required"),
  basePrompt: z.string().min(1, "Base prompt is required").max(5000),
  negativePrompt: z.string().max(2000).optional(),
  width: z.number().int().min(256).max(2048),
  height: z.number().int().min(256).max(2048),
  sampleCount: z.number().int().min(1).max(20),
  status: z.enum(["DRAFT", "ACTIVE", "DISABLED"]).optional(),
  tags: z.array(z.string()).optional(),
});

// POST /api/admin/templates — create a new template
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { description, negativePrompt, tags, ...rest } = parsed.data;

  const template = await prisma.template.create({
    data: {
      ...rest,
      description: description || null,
      negativePrompt: negativePrompt || null,
      tags: tags || [],
    },
  });

  return NextResponse.json({ data: template }, { status: 201 });
}
