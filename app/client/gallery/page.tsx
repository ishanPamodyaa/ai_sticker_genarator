import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";
import { ImageGrid } from "@/components/images/image-grid";

export default async function GalleryPage() {
  const storage = getStorage();

  const samples = await prisma.generatedImage.findMany({
    where: {
      type: "SAMPLE",
      status: "ACTIVE",
      template: { status: "ACTIVE" },
    },
    include: {
      template: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Add signed URLs
  const samplesWithUrls = await Promise.all(
    samples.map(async (img) => ({
      ...img,
      imageUrl: await storage.getSignedUrl(img.gcsPath),
    }))
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sticker Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Browse AI-generated sticker designs. Click any sticker to generate your own unique variation.
        </p>
      </div>

      {samplesWithUrls.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No stickers available yet.</p>
          <p className="text-sm mt-1">Check back soon or ask an admin to create templates.</p>
        </div>
      ) : (
        <ImageGrid images={samplesWithUrls} showGenerateButton />
      )}
    </div>
  );
}
