import { prisma } from "@/lib/prisma";
import { JobList } from "@/components/jobs/job-list";

export default async function JobsPage() {
  const jobs = await prisma.generationJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      template: { select: { name: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-muted-foreground">No jobs yet.</p>
      ) : (
        <JobList jobs={jobs} />
      )}
    </div>
  );
}
