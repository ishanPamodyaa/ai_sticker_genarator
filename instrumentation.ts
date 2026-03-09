export async function register() {
  // Auto-start the job worker inside the Next.js server process (dev & prod).
  // In production you can also run `npm run worker` as a separate process instead.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prisma } = await import("@/lib/prisma");
    const { processJob } = await import("@/lib/jobs/processor");

    const POLL_INTERVAL_MS = 2000;

    async function poll() {
      try {
        const job = await prisma.generationJob.findFirst({
          where: { status: "QUEUED" },
          orderBy: { createdAt: "asc" },
        });

        if (job) {
          console.log(`[worker] Processing job ${job.id} (${job.jobType})...`);
          try {
            await processJob(job.id);
            console.log(`[worker] Job ${job.id} completed.`);
          } catch (err) {
            console.error(`[worker] Job ${job.id} failed:`, err);
          }
        }
      } catch (err) {
        console.error("[worker] Polling error:", err);
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    }

    console.log("[worker] Started job polling inside Next.js server.");
    setTimeout(poll, POLL_INTERVAL_MS);
  }
}
