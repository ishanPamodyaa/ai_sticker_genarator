import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

// GET /api/images/local/[...path] — serve local images for dev without GCS
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const relativePath = segments.join("/");

  // Prevent path traversal
  if (relativePath.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const fullPath = path.join(process.cwd(), "data", "images", relativePath);

  try {
    const buffer = await fs.readFile(fullPath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(buffer.length),
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
