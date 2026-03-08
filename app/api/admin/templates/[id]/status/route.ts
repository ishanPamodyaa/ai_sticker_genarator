import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

// PATCH /api/admin/templates/[id]/status — update template status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const schema = z.object({
    status: z.enum(["DRAFT", "ACTIVE", "DISABLED"]),
  });
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const template = await prisma.template.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ data: template });
}
