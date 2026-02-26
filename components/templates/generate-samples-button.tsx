"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { generateSamples } from "@/app/_actions/generation.actions";
import { JOB_POLL_INTERVAL_MS } from "@/lib/constants";

export function GenerateSamplesButton({ templateId }: { templateId: string }) {
  const [isPending, startTransition] = useTransition();
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const { jobId } = await generateSamples(templateId);
        setJobStatus("QUEUED");

        // Poll for job completion
        const poll = async () => {
          const res = await fetch(`/api/jobs/${jobId}/status`);
          const data = await res.json();
          setJobStatus(data.status);

          if (data.status === "SUCCESS") {
            setJobStatus(null);
            router.refresh();
          } else if (data.status === "FAILED") {
            setJobStatus(`Failed: ${data.error || "Unknown error"}`);
            setTimeout(() => setJobStatus(null), 5000);
          } else {
            setTimeout(poll, JOB_POLL_INTERVAL_MS);
          }
        };

        setTimeout(poll, JOB_POLL_INTERVAL_MS);
      } catch {
        setJobStatus("Error triggering generation");
        setTimeout(() => setJobStatus(null), 3000);
      }
    });
  };

  if (jobStatus) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {(jobStatus === "QUEUED" || jobStatus === "RUNNING") && (
          <Spinner size="sm" />
        )}
        <span className="text-muted-foreground">
          {jobStatus === "QUEUED" && "Queued..."}
          {jobStatus === "RUNNING" && "Generating..."}
          {jobStatus.startsWith("Failed") && (
            <span className="text-destructive">{jobStatus}</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <Button onClick={handleGenerate} disabled={isPending} size="sm">
      {isPending ? "Starting..." : "Generate Samples"}
    </Button>
  );
}
