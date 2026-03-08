import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getStorage } from "@/lib/storage";

// GET /api/client/gallery — sample images from ACTIVE templates with signed URLs
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getStorage();

  const images = await prisma.generatedImage.findMany({
    where: {
      type: "SAMPLE",
      status: "ACTIVE",
      template: { status: "ACTIVE" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      template: {
        select: { id: true, name: true, description: true, basePrompt: true },
      },
    },
  });

  const imagesWithUrls = await Promise.all(
    images.map(async (img) => ({
      id: img.id,
      templateId: img.templateId,
      templateName: img.template.name,
      templateDescription: img.template.description,
      width: img.width,
      height: img.height,
      createdAt: img.createdAt,
      imageUrl: await storage.getSignedUrl(img.gcsPath),
    }))
  );

  return NextResponse.json({ data: imagesWithUrls });
}
