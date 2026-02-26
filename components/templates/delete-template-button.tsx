"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteTemplate } from "@/app/_actions/template.actions";

export function DeleteTemplateButton({ templateId }: { templateId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-destructive">Are you sure?</span>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          startTransition(() => deleteTemplate(templateId));
        }}
      >
        {isPending ? "Deleting..." : "Yes, Delete"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirming(false)}
      >
        Cancel
      </Button>
    </div>
  );
}
