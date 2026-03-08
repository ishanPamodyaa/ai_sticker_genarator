import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getStorage } from "@/lib/storage";

// GET /api/client/history — user's generated images with signed URLs
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getStorage();

  const images = await prisma.generatedImage.findMany({
    where: {
      createdById: session.user.id,
      type: "GENERATED",
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
    include: {
      template: { select: { id: true, name: true } },
    },
  });

  const imagesWithUrls = await Promise.all(
    images.map(async (img) => ({
      id: img.id,
      templateName: img.template.name,
      subjectPrompt: img.subjectPrompt,
      width: img.width,
      height: img.height,
      createdAt: img.createdAt,
      imageUrl: await storage.getSignedUrl(img.gcsPath),
    }))
  );

  return NextResponse.json({ data: imagesWithUrls });
}
