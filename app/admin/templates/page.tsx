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
        <h1 className="text-3xl font-extrabold tracking-tight">Templates</h1>
        <Link href="/admin/templates/new">
          <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] border-0 rounded-full transition-all hover:scale-105">
            Create Template
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground max-w-xl mx-auto">
          <p className="text-lg font-medium text-foreground mb-2">No templates yet.</p>
          <p className="text-sm opacity-80">Create your first template to get started.</p>
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
