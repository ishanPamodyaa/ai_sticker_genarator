"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SubjectPromptFormProps {
  sampleId: string;
}

export function SubjectPromptForm({ sampleId }: SubjectPromptFormProps) {
  const [subjectPrompt, setSubjectPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subjectPrompt.trim()) {
      setError("Please enter a subject for your sticker.");
      return;
    }

    setIsPending(true);

    try {
      const res = await fetch("/api/client/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleId, subjectPrompt: subjectPrompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsPending(false);
        return;
      }

      router.push(`/client/result/${data.data.jobId}`);
    } catch {
      setError("Network error. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="subjectPrompt" className="block text-sm font-medium mb-1.5">
          What should the sticker be of?
        </label>
        <Textarea
          id="subjectPrompt"
          value={subjectPrompt}
          onChange={(e) => setSubjectPrompt(e.target.value)}
          placeholder="e.g., a happy corgi wearing sunglasses"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Describe the subject of your sticker. The template&apos;s style will be applied automatically.
        </p>
      </div>

      <Button type="submit" disabled={isPending} size="lg" variant="premium" className="w-full">
        {isPending ? "Starting Generation..." : "Generate Sticker"}
      </Button>
    </form>
  );
}
