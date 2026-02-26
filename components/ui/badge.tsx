import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "draft" | "active" | "disabled" | "queued" | "running" | "success" | "failed";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  draft: "bg-status-draft/15 text-status-draft",
  active: "bg-status-active/15 text-status-active",
  disabled: "bg-status-disabled/15 text-status-disabled",
  queued: "bg-status-queued/15 text-status-queued",
  running: "bg-status-running/15 text-status-running",
  success: "bg-status-success/15 text-status-success",
  failed: "bg-status-failed/15 text-status-failed",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
