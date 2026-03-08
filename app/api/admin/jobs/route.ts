import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/admin/jobs — list all jobs with optional status filter
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where = status
    ? { status: status as "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED" }
    : {};

  const jobs = await prisma.generationJob.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      template: { select: { id: true, name: true } },
      requestedBy: { select: { id: true, email: true } },
    },
  });

  return NextResponse.json({ data: jobs });
}
