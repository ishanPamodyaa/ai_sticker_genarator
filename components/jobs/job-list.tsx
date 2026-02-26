import { JobStatusBadge } from "./job-status-badge";
import { formatDate } from "@/lib/utils";

interface Job {
  id: string;
  jobType: "SAMPLE_BATCH" | "CLIENT_GENERATION";
  status: "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
  template?: { name: string } | null;
}

export function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3 pr-4 font-medium text-muted-foreground">Status</th>
            <th className="py-3 pr-4 font-medium text-muted-foreground">Type</th>
            {jobs[0]?.template && (
              <th className="py-3 pr-4 font-medium text-muted-foreground">Template</th>
            )}
            <th className="py-3 pr-4 font-medium text-muted-foreground">Created</th>
            <th className="py-3 pr-4 font-medium text-muted-foreground">Error</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b">
              <td className="py-3 pr-4">
                <JobStatusBadge status={job.status} />
              </td>
              <td className="py-3 pr-4">
                {job.jobType === "SAMPLE_BATCH" ? "Sample Batch" : "Client Generation"}
              </td>
              {job.template && (
                <td className="py-3 pr-4">{job.template.name}</td>
              )}
              <td className="py-3 pr-4 text-muted-foreground">
                {formatDate(job.createdAt)}
              </td>
              <td className="py-3 pr-4 text-destructive text-xs max-w-xs truncate">
                {job.error || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
