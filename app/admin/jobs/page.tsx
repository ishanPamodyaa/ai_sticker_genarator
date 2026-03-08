import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const where = status
    ? { status: status as "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED" }
    : {};

  const [jobs, counts] = await Promise.all([
    prisma.generationJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        template: { select: { name: true, id: true } },
        requestedBy: { select: { email: true } },
      },
    }),
    prisma.generationJob.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count])
  );
  const totalJobs = counts.reduce((sum, c) => sum + c._count, 0);

  const filters = [
    { label: "All", value: undefined, count: totalJobs },
    { label: "Queued", value: "QUEUED", count: countMap.QUEUED || 0 },
    { label: "Running", value: "RUNNING", count: countMap.RUNNING || 0 },
    { label: "Success", value: "SUCCESS", count: countMap.SUCCESS || 0 },
    { label: "Failed", value: "FAILED", count: countMap.FAILED || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => {
          const isActive = (status || undefined) === f.value;
          const href = f.value ? `/admin/jobs?status=${f.value}` : "/admin/jobs";
          return (
            <Link
              key={f.label}
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="text-xs opacity-70">({f.count})</span>
            </Link>
          );
        })}
      </div>

      {jobs.length === 0 ? (
        <p className="text-muted-foreground">No jobs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 pr-4 font-medium text-muted-foreground">Status</th>
                <th className="py-3 pr-4 font-medium text-muted-foreground">Type</th>
                <th className="py-3 pr-4 font-medium text-muted-foreground">Template</th>
                <th className="py-3 pr-4 font-medium text-muted-foreground">Requested By</th>
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
                    <Badge variant={job.jobType === "SAMPLE_BATCH" ? "default" : "active"}>
                      {job.jobType === "SAMPLE_BATCH" ? "Samples" : "Client"}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/templates/${job.template.id}`}
                      className="text-primary hover:underline"
                    >
                      {job.template.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {job.requestedBy?.email || "\u2014"}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="py-3 pr-4 text-destructive text-xs max-w-xs truncate">
                    {job.error || "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
