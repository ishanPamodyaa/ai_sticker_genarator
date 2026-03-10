import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TemplateStatusBadge } from "@/components/templates/template-status-badge";
import { DeleteTemplateButton } from "@/components/templates/delete-template-button";
import { GenerateSamplesButton } from "@/components/templates/generate-samples-button";
import { ImageGrid } from "@/components/images/image-grid";
import { JobList } from "@/components/jobs/job-list";
import { formatDate } from "@/lib/utils";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      images: {
        where: { type: "SAMPLE", status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      },
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          template: { select: { name: true } },
        },
      },
    },
  });

  if (!template) notFound();

  // Get signed URLs for sample images
  const storage = getStorage();
  const imagesWithUrls = await Promise.all(
    template.images.map(async (img) => ({
      ...img,
      imageUrl: await storage.getSignedUrl(img.gcsPath),
    }))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-none shadow-xl bg-gradient-to-r from-white/5 to-transparent">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">{template.name}</h1>
            <TemplateStatusBadge status={template.status} />
          </div>
          {template.description && (
            <p className="text-muted-foreground mt-1">{template.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/templates/${id}/edit`}>
            <Button variant="outline" className="glass bg-white/5 hover:bg-white/10 border-white/10 rounded-full h-10 px-6 pointer-events-auto">Edit</Button>
          </Link>
          <DeleteTemplateButton templateId={id} />
        </div>
      </div>

      {/* Template Details */}
      <Card className="glass-card border-none shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
        <CardHeader className="border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold">Template Details</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Provider</dt>
              <dd className="font-medium">{template.provider}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Model</dt>
              <dd className="font-medium">{template.modelName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Size</dt>
              <dd className="font-medium">{template.width}x{template.height}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sample Count</dt>
              <dd className="font-medium">{template.sampleCount}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Base Prompt</dt>
              <dd className="font-medium mt-1 whitespace-pre-wrap">{template.basePrompt}</dd>
            </div>
            {template.negativePrompt && (
              <div className="col-span-2">
                <dt className="text-muted-foreground">Negative Prompt</dt>
                <dd className="font-medium mt-1 whitespace-pre-wrap">{template.negativePrompt}</dd>
              </div>
            )}
            {template.tags.length > 0 && (
              <div className="col-span-2">
                <dt className="text-muted-foreground">Tags</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {template.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">{formatDate(template.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Updated</dt>
              <dd className="font-medium">{formatDate(template.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Sample Images */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border-none shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Sample Images ({template.images.length})
          </h2>
          <GenerateSamplesButton templateId={template.id} />
        </div>
        {template.images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-white/20 rounded-xl bg-white/5">
            <p className="text-lg font-medium text-foreground mb-1">No sample images yet.</p>
            <p className="text-sm opacity-80">Generate samples to populate the gallery.</p>
          </div>
        ) : (
          <ImageGrid images={imagesWithUrls} />
        )}
      </div>

      {/* Recent Jobs */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border-none shadow-2xl bg-gradient-to-b from-white/5 to-transparent">
        <h2 className="text-xl font-bold mb-6">Recent Jobs</h2>
        {template.jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs yet.</p>
        ) : (
          <JobList jobs={template.jobs} />
        )}
      </div>
    </div>
  );
}
