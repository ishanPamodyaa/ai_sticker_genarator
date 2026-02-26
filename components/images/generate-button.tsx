"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateFromSample } from "@/app/_actions/generation.actions";

export function GenerateFromSampleButton({ sampleId }: { sampleId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGenerate = () => {
    startTransition(async () => {
      const { jobId } = await generateFromSample(sampleId);
      router.push(`/result/${jobId}`);
    });
  };

  return (
    <Button onClick={handleGenerate} disabled={isPending} size="lg">
      {isPending ? "Starting Generation..." : "Generate Now"}
    </Button>
  );
}
