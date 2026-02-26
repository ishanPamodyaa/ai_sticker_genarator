import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TemplateStatusBadge } from "./template-status-badge";
import { truncate } from "@/lib/utils";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    status: "DRAFT" | "ACTIVE" | "DISABLED";
    provider: string;
    prompt: string;
    tags: string[];
    _count: { images: number; jobs: number };
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/admin/templates/${template.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <TemplateStatusBadge status={template.status} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {truncate(template.prompt, 120)}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Provider: {template.provider}</span>
            <span>{template._count.images} images</span>
            <span>{template._count.jobs} jobs</span>
          </div>
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
