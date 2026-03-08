"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  PROVIDER_OPTIONS,
  ALLOWED_SIZES,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_SAMPLE_COUNT,
} from "@/lib/constants";

interface TemplateFormProps {
  templateId?: string;
  defaultValues?: {
    name?: string;
    description?: string;
    provider?: string;
    modelName?: string;
    basePrompt?: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    sampleCount?: number;
    status?: string;
    tags?: string[];
  };
  submitLabel?: string;
}

export function TemplateForm({
  templateId,
  defaultValues,
  submitLabel = "Create Template",
}: TemplateFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const body = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      provider: formData.get("provider") as string,
      modelName: formData.get("modelName") as string,
      basePrompt: formData.get("basePrompt") as string,
      negativePrompt: (formData.get("negativePrompt") as string) || undefined,
      width: Number(formData.get("width")),
      height: Number(formData.get("height")),
      sampleCount: Number(formData.get("sampleCount")),
      status: formData.get("status") as string,
      tags,
    };

    try {
      const url = templateId
        ? `/api/admin/templates/${templateId}`
        : "/api/admin/templates";
      const method = templateId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        setError(data.error || "Something went wrong");
        return;
      }

      const id = templateId || data.data.id;
      router.push(`/admin/templates/${id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          Name *
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues?.name}
          placeholder="My Sticker Template"
          error={!!fieldErrors.name}
        />
        {fieldErrors.name && (
          <p className="text-sm text-destructive mt-1">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          placeholder="Optional description"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="provider" className="block text-sm font-medium mb-1.5">
            Provider *
          </label>
          <Select
            id="provider"
            name="provider"
            defaultValue={defaultValues?.provider ?? "mock"}
            error={!!fieldErrors.provider}
          >
            {PROVIDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          {fieldErrors.provider && (
            <p className="text-sm text-destructive mt-1">{fieldErrors.provider[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="modelName" className="block text-sm font-medium mb-1.5">
            Model Name *
          </label>
          <Input
            id="modelName"
            name="modelName"
            defaultValue={defaultValues?.modelName ?? "mock-v1"}
            placeholder="e.g. mock-v1"
            error={!!fieldErrors.modelName}
          />
          {fieldErrors.modelName && (
            <p className="text-sm text-destructive mt-1">{fieldErrors.modelName[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="basePrompt" className="block text-sm font-medium mb-1.5">
          Base Prompt (style only — no subject) *
        </label>
        <Textarea
          id="basePrompt"
          name="basePrompt"
          defaultValue={defaultValues?.basePrompt}
          placeholder="A cute kawaii sticker, bold black outline, chibi style, vibrant colors..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Describe the art style. The client will add their own subject (e.g., &quot;a happy corgi&quot;).
        </p>
        {fieldErrors.basePrompt && (
          <p className="text-sm text-destructive mt-1">{fieldErrors.basePrompt[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="negativePrompt" className="block text-sm font-medium mb-1.5">
          Negative Prompt
        </label>
        <Textarea
          id="negativePrompt"
          name="negativePrompt"
          defaultValue={defaultValues?.negativePrompt}
          placeholder="blurry, low quality, distorted..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium mb-1.5">
            Width
          </label>
          <Select
            id="width"
            name="width"
            defaultValue={String(defaultValues?.width ?? DEFAULT_WIDTH)}
          >
            {ALLOWED_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium mb-1.5">
            Height
          </label>
          <Select
            id="height"
            name="height"
            defaultValue={String(defaultValues?.height ?? DEFAULT_HEIGHT)}
          >
            {ALLOWED_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="sampleCount" className="block text-sm font-medium mb-1.5">
            Sample Count
          </label>
          <Input
            id="sampleCount"
            name="sampleCount"
            type="number"
            min={1}
            max={20}
            defaultValue={defaultValues?.sampleCount ?? DEFAULT_SAMPLE_COUNT}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1.5">
          Status
        </label>
        <Select
          id="status"
          name="status"
          defaultValue={defaultValues?.status ?? "DRAFT"}
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="DISABLED">Disabled</option>
        </Select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1.5">
          Tags (comma-separated)
        </label>
        <Input
          id="tags"
          name="tags"
          defaultValue={defaultValues?.tags?.join(", ")}
          placeholder="cute, animals, sticker"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
