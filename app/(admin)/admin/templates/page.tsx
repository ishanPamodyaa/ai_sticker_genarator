import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/templates/template-card";

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { images: true, jobs: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link href="/admin/templates/new">
          <Button>Create Template</Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No templates yet. Create your first template to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
