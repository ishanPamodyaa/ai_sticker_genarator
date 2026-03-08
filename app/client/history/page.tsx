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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My History</h1>
        <p className="text-muted-foreground mt-2">
          Your generated sticker images
        </p>
      </div>

      {imagesWithUrls.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No generated images yet.</p>
          <p className="text-sm mt-1">
            Visit the gallery and generate your first sticker!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesWithUrls.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt="Generated sticker"
                  className="w-full h-full object-cover"
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
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Recent Generation Jobs</h2>
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-md border px-4 py-3 text-sm"
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
