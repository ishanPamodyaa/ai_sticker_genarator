import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TemplateStatusBadge } from "./template-status-badge";
interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    status: "DRAFT" | "ACTIVE" | "DISABLED";
    provider: string;
    basePrompt: string;
    tags: string[];
    _count: { images: number; jobs: number };
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/admin/templates/${template.id}`} className="block h-full cursor-default">
      <Card className="glass-card bg-gradient-to-b from-white/5 to-transparent border-none shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all h-full cursor-pointer overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
            <TemplateStatusBadge status={template.status} />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 flex flex-col justify-between h-[calc(100%-5rem)]">
          <div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {template.basePrompt}
            </p>
          </div>
            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1">Provider: {template.provider}</span>
                <span className="flex items-center gap-1">{template._count.images} images</span>
                <span className="flex items-center gap-1">{template._count.jobs} jobs</span>
              </div>
              {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
