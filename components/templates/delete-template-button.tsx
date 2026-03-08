"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteTemplateButton({ templateId }: { templateId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/templates");
        router.refresh();
      }
    } catch {
      setIsPending(false);
    }
  };

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
        onClick={handleDelete}
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
