import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";

// GET /api/images/[id] — return signed URL for an image
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const image = await prisma.generatedImage.findUnique({ where: { id } });
  if (!image || image.status === "DELETED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const storage = getStorage();
    const imageUrl = await storage.getSignedUrl(image.gcsPath);

    return NextResponse.json({
      data: {
        id: image.id,
        imageUrl,
        width: image.width,
        height: image.height,
        type: image.type,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Image not found on storage" },
      { status: 404 }
    );
  }
}
