"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { JOB_POLL_INTERVAL_MS } from "@/lib/constants";
import { getImageUrl } from "@/lib/utils";

interface JobProgressProps {
  jobId: string;
}

interface JobStatusData {
  id: string;
  status: "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";
  error?: string | null;
  resultImageId?: string | null;
}

export function JobProgress({ jobId }: JobProgressProps) {
  const [job, setJob] = useState<JobStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}/status`);
        if (!res.ok) throw new Error("Failed to fetch job status");
        const data: JobStatusData = await res.json();
        if (!active) return;
        setJob(data);

        if (data.status === "QUEUED" || data.status === "RUNNING") {
          setTimeout(poll, JOB_POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    poll();
    return () => { active = false; };
  }, [jobId]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!job || job.status === "QUEUED") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Queued, waiting to start...</p>
      </div>
    );
  }

  if (job.status === "RUNNING") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Generating your image...</p>
      </div>
    );
  }

  if (job.status === "FAILED") {
    return (
      <div className="text-center py-8">
        <p className="text-destructive font-medium">Generation failed</p>
        {job.error && (
          <p className="text-sm text-muted-foreground mt-1">{job.error}</p>
        )}
      </div>
    );
  }

  // SUCCESS
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {job.resultImageId && (
        <>
          <div className="rounded-lg overflow-hidden border shadow-lg max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(job.resultImageId)}
              alt="Generated sticker"
              className="w-full h-auto"
            />
          </div>
          <a
            href={getImageUrl(job.resultImageId)}
            download="sticker.png"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Download PNG
          </a>
        </>
      )}
    </div>
  );
}
