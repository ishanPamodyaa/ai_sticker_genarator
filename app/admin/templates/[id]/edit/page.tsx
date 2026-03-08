import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplateForm } from "@/components/templates/template-form";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Template</h1>
      <TemplateForm
        templateId={id}
        submitLabel="Update Template"
        defaultValues={{
          name: template.name,
          description: template.description ?? undefined,
          provider: template.provider,
          modelName: template.modelName,
          basePrompt: template.basePrompt,
          negativePrompt: template.negativePrompt ?? undefined,
          width: template.width,
          height: template.height,
          sampleCount: template.sampleCount,
          status: template.status,
          tags: template.tags,
        }}
      />
    </div>
  );
}
