import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function HistoryPage() {
  const session = await auth();
  if (!session) return null;

  const storage = getStorage();

  const images = await prisma.generatedImage.findMany({
    where: {
      createdById: session.user.id,
      type: "GENERATED",
    },
    include: {
      template: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const jobs = await prisma.generationJob.findMany({
    where: {
      requestedById: session.user.id,
      jobType: "CLIENT_GENERATION",
    },
    include: {
      template: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Add signed URLs to images
  const imagesWithUrls = await Promise.all(
    images.map(async (img) => ({
      ...img,
      imageUrl: await storage.getSignedUrl(img.gcsPath),
    }))
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          My <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">History</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Your generated sticker images
        </p>
      </div>

      {imagesWithUrls.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground max-w-xl mx-auto relative z-10">
          <p className="text-lg">No generated images yet.</p>
          <p className="text-sm mt-1">
            Visit the gallery and generate your first sticker!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          {imagesWithUrls.map((image) => (
            <Card key={image.id} className="overflow-hidden glass-card border-none shadow-xl bg-gradient-to-b from-white/5 to-transparent hover:scale-[1.02] transition-transform duration-300">
              <div className="aspect-square relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt="Generated sticker"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate">
                  {image.template.name}
                </p>
                {image.subjectPrompt && (
                  <p className="text-xs text-muted-foreground truncate">
                    {image.subjectPrompt}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDate(image.createdAt)}
                </p>
                <a
                  href={image.imageUrl}
                  download={`sticker-${image.id.slice(0, 8)}.png`}
                  className="inline-block text-xs text-primary hover:underline"
                >
                  Download
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent jobs section */}
      {jobs.length > 0 && (
        <div className="mt-12 relative z-10 glass-card p-6 md:p-8 rounded-2xl border-none shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
          <h2 className="text-xl font-bold mb-6">Recent Generation Jobs</h2>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      job.status === "SUCCESS"
                        ? "success"
                        : job.status === "FAILED"
                          ? "failed"
                          : job.status === "RUNNING"
                            ? "running"
                            : "queued"
                    }
                  >
                    {job.status}
                  </Badge>
                  <span>{job.template.name}</span>
                  {job.subjectPrompt && (
                    <span className="text-muted-foreground text-xs truncate max-w-xs">
                      — {job.subjectPrompt}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  {formatDate(job.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
