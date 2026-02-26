import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border-2",
  default: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3",
};

export function Spinner({ size = "default", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-muted-foreground/30 border-t-primary",
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
