import { TemplateForm } from "@/components/templates/template-form";

export default function NewTemplatePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Template</span>
        </h1>
        <p className="text-muted-foreground mt-2">Configure a new AI sticker generation template</p>
      </div>
      <div className="glass-card p-6 md:p-8 rounded-2xl border-none shadow-2xl relative z-10 bg-gradient-to-b from-white/5 to-transparent">
        <TemplateForm submitLabel="Create Template" />
      </div>
    </div>
  );
}
