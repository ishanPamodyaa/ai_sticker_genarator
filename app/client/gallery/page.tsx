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
    <div className="container mx-auto px-4 py-12 relative min-h-screen">
      {/* Background glowing orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />

      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Sticker <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Gallery</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse AI-generated sticker designs. Click any sticker to generate your own unique variation using its style.
        </p>
      </div>

      {samplesWithUrls.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground max-w-xl mx-auto">
          <p className="text-xl font-medium mb-2 text-foreground">No stickers available yet.</p>
          <p className="text-base opacity-80">Check back soon or ask an admin to create templates.</p>
        </div>
      ) : (
        <div className="animate-slide-up">
          <ImageGrid images={samplesWithUrls} showGenerateButton />
        </div>
      )}
    </div>
  );
}
