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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Active <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">Jobs</span></h1>
        <p className="text-muted-foreground mt-2">Monitor system-wide sticker generation tasks</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => {
          const isActive = (status || undefined) === f.value;
          const href = f.value ? `/admin/jobs?status=${f.value}` : "/admin/jobs";
          return (
            <Link
              key={f.label}
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 border border-transparent"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              {f.label}
              <span className="text-xs opacity-70">({f.count})</span>
            </Link>
          );
        })}
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground max-w-xl mx-auto">
          <p className="text-lg font-medium text-foreground mb-2">No jobs found.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border-none shadow-2xl bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left bg-white/5">
                  <th className="py-4 pl-6 pr-4 font-semibold text-muted-foreground">Status</th>
                  <th className="py-4 pr-4 font-semibold text-muted-foreground">Type</th>
                  <th className="py-4 pr-4 font-semibold text-muted-foreground">Template</th>
                  <th className="py-4 pr-4 font-semibold text-muted-foreground">Requested By</th>
                  <th className="py-4 pr-4 font-semibold text-muted-foreground">Created</th>
                  <th className="py-4 pr-6 font-semibold text-muted-foreground">Error</th>
                </tr>
            </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-6 pr-4">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={job.jobType === "SAMPLE_BATCH" ? "default" : "active"} className="bg-white/10 hover:bg-white/20 text-white border-0">
                        {job.jobType === "SAMPLE_BATCH" ? "Samples" : "Client"}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/admin/templates/${job.template.id}`}
                        className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors hover:underline font-medium"
                      >
                        {job.template.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {job.requestedBy?.email || "\u2014"}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="py-4 pr-6 text-destructive text-xs max-w-xs truncate">
                      {job.error || "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
