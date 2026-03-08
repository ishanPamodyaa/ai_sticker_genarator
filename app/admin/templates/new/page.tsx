import { TemplateForm } from "@/components/templates/template-form";

export default function NewTemplatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Template</h1>
      <TemplateForm submitLabel="Create Template" />
    </div>
  );
}
