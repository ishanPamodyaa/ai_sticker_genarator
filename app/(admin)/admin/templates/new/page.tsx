import { createTemplate } from "@/app/_actions/template.actions";
import { TemplateForm } from "@/components/templates/template-form";

export default function NewTemplatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Template</h1>
      <TemplateForm action={createTemplate} submitLabel="Create Template" />
    </div>
  );
}
