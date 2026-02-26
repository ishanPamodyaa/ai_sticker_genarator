import { Badge } from "@/components/ui/badge";

type JobStatus = "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";

const statusVariant: Record<JobStatus, "queued" | "running" | "success" | "failed"> = {
  QUEUED: "queued",
  RUNNING: "running",
  SUCCESS: "success",
  FAILED: "failed",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
