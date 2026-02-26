import { Badge } from "@/components/ui/badge";

type TemplateStatus = "DRAFT" | "ACTIVE" | "DISABLED";

const statusVariant: Record<TemplateStatus, "draft" | "active" | "disabled"> = {
  DRAFT: "draft",
  ACTIVE: "active",
  DISABLED: "disabled",
};

export function TemplateStatusBadge({ status }: { status: TemplateStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
