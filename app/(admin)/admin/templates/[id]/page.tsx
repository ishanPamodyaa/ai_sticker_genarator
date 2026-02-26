import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <TemplateStatusBadge status={template.status} />
          </div>
          {template.description && (
            <p className="text-muted-foreground mt-1">{template.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/templates/${id}/edit`}>
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
          <DeleteTemplateButton templateId={id} />
        </div>
      </div>

      {/* Template Details */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Template Details</h2>
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
              <dt className="text-muted-foreground">Prompt</dt>
              <dd className="font-medium mt-1 whitespace-pre-wrap">{template.prompt}</dd>
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Sample Images ({template.images.length})
          </h2>
          <GenerateSamplesButton templateId={template.id} />
        </div>
        {template.images.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
            <p>No sample images yet. Generate samples to populate the gallery.</p>
          </div>
        ) : (
          <ImageGrid images={template.images} />
        )}
      </div>

      {/* Recent Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>
        {template.jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs yet.</p>
        ) : (
          <JobList jobs={template.jobs} />
        )}
      </div>
    </div>
  );
}
