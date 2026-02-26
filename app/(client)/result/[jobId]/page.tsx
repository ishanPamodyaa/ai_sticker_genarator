import Link from "next/link";
import { JobProgress } from "@/components/jobs/job-progress";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Generated Sticker</h1>

      <JobProgress jobId={jobId} />

      <div className="mt-8 text-center">
        <Link
          href="/gallery"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    </div>
  );
}
