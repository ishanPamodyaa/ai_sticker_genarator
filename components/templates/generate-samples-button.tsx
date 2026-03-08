"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { JOB_POLL_INTERVAL_MS } from "@/lib/constants";

export function GenerateSamplesButton({ templateId }: { templateId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsPending(true);
    try {
      const res = await fetch(
        `/api/admin/templates/${templateId}/generate-samples`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        setJobStatus(`Error: ${data.error}`);
        setTimeout(() => {
          setJobStatus(null);
          setIsPending(false);
        }, 3000);
        return;
      }

      const jobId = data.data.jobId;
      setJobStatus("QUEUED");

      const poll = async () => {
        const statusRes = await fetch(`/api/jobs/${jobId}/status`);
        const statusData = await statusRes.json();
        setJobStatus(statusData.status);

        if (statusData.status === "SUCCESS") {
          setJobStatus(null);
          setIsPending(false);
          router.refresh();
        } else if (statusData.status === "FAILED") {
          setJobStatus(`Failed: ${statusData.error || "Unknown error"}`);
          setTimeout(() => {
            setJobStatus(null);
            setIsPending(false);
          }, 5000);
        } else {
          setTimeout(poll, JOB_POLL_INTERVAL_MS);
        }
      };

      setTimeout(poll, JOB_POLL_INTERVAL_MS);
    } catch {
      setJobStatus("Error triggering generation");
      setTimeout(() => {
        setJobStatus(null);
        setIsPending(false);
      }, 3000);
    }
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
          {jobStatus.startsWith("Error") && (
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
