"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PROVIDER_OPTIONS, ALLOWED_SIZES, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SAMPLE_COUNT } from "@/lib/constants";
import type { TemplateActionState } from "@/app/_actions/template.actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-sm text-destructive mt-1">{errors[0]}</p>
  );
}

interface TemplateFormProps {
  action: (prevState: TemplateActionState, formData: FormData) => Promise<TemplateActionState>;
  defaultValues?: {
    name?: string;
    description?: string;
    provider?: string;
    modelName?: string;
    prompt?: string;
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
  action,
  defaultValues,
  submitLabel = "Create Template",
}: TemplateFormProps) {
  const [state, formAction] = useActionState(action, { errors: {} });

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.message && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.message}
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
          error={!!state.errors?.name}
        />
        <FieldError errors={state.errors?.name} />
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
            error={!!state.errors?.provider}
          >
            {PROVIDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <FieldError errors={state.errors?.provider} />
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
            error={!!state.errors?.modelName}
          />
          <FieldError errors={state.errors?.modelName} />
        </div>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium mb-1.5">
          Prompt *
        </label>
        <Textarea
          id="prompt"
          name="prompt"
          defaultValue={defaultValues?.prompt}
          placeholder="A cute cat sticker, bold outline, minimal background..."
          rows={4}
        />
        <FieldError errors={state.errors?.prompt} />
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
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
