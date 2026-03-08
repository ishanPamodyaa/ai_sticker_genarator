import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { processJob } from "../lib/jobs/processor";

const POLL_INTERVAL_MS = 2000;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

let running = true;

async function pollAndProcess() {
  console.log("Worker started. Polling for jobs...");

  while (running) {
    try {
      // Find the oldest QUEUED job
      const job = await prisma.generationJob.findFirst({
        where: { status: "QUEUED" },
        orderBy: { createdAt: "asc" },
      });

      if (job) {
        console.log(`Processing job ${job.id} (${job.jobType})...`);
        try {
          await processJob(job.id);
          console.log(`Job ${job.id} completed.`);
        } catch (err) {
          console.error(`Job ${job.id} failed:`, err);
        }
      } else {
        // No jobs, wait before polling again
        await sleep(POLL_INTERVAL_MS);
      }
    } catch (err) {
      console.error("Worker polling error:", err);
      await sleep(POLL_INTERVAL_MS);
    }
  }

  console.log("Worker stopped.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nReceived SIGINT, shutting down...");
  running = false;
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  running = false;
});

pollAndProcess().catch((err) => {
  console.error("Worker fatal error:", err);
  process.exit(1);
});
