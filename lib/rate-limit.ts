import { prisma } from "@/lib/prisma";
import { DAILY_GENERATION_LIMIT } from "@/lib/constants";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * DB-based daily rate limiter.
 * Counts GenerationJob records created by the user today (UTC).
 * Works across multiple instances — no in-memory state.
 */
export async function checkDailyRateLimit(
  userId: string
): Promise<RateLimitResult> {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const count = await prisma.generationJob.count({
    where: {
      requestedById: userId,
      createdAt: { gte: startOfDay },
    },
  });

  return {
    allowed: count < DAILY_GENERATION_LIMIT,
    remaining: Math.max(0, DAILY_GENERATION_LIMIT - count),
  };
}
