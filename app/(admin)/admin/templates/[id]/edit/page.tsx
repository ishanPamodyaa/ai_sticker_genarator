import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTemplate } from "@/app/_actions/template.actions";
import { TemplateForm } from "@/components/templates/template-form";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) notFound();

  // Bind the template ID to the updateTemplate action
  const boundAction = updateTemplate.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Template</h1>
      <TemplateForm
        action={boundAction}
        submitLabel="Update Template"
        defaultValues={{
          name: template.name,
          description: template.description ?? undefined,
          provider: template.provider,
          modelName: template.modelName,
          prompt: template.prompt,
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
