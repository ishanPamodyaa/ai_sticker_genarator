import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const image = await prisma.imageAsset.findUnique({ where: { id } });
  if (!image || image.status === "DELETED") {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const storage = getStorage();
    const buffer = await storage.getBuffer(image.gcsPath);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(buffer.length),
      },
    });
  } catch {
    return new NextResponse("Image not found on storage", { status: 404 });
  }
}
