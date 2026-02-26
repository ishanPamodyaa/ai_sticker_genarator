"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  provider: z.string().min(1, "Provider is required"),
  modelName: z.string().min(1, "Model name is required"),
  prompt: z.string().min(1, "Prompt is required").max(5000),
  negativePrompt: z.string().max(2000).optional(),
  width: z.coerce.number().int().min(256).max(2048),
  height: z.coerce.number().int().min(256).max(2048),
  sampleCount: z.coerce.number().int().min(1).max(20),
  status: z.enum(["DRAFT", "ACTIVE", "DISABLED"]),
  tags: z.string().optional(),
});

export type TemplateActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createTemplate(
  _prevState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = templateSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Validation failed.",
    };
  }

  const { tags, description, negativePrompt, ...rest } = parsed.data;
  const tagArray = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const template = await prisma.template.create({
    data: {
      ...rest,
      description: description || null,
      negativePrompt: negativePrompt || null,
      tags: tagArray,
    },
  });

  revalidatePath("/admin/templates");
  redirect(`/admin/templates/${template.id}`);
}

export async function updateTemplate(
  id: string,
  _prevState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = templateSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Validation failed.",
    };
  }

  const { tags, description, negativePrompt, ...rest } = parsed.data;
  const tagArray = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  await prisma.template.update({
    where: { id },
    data: {
      ...rest,
      description: description || null,
      negativePrompt: negativePrompt || null,
      tags: tagArray,
    },
  });

  revalidatePath("/admin/templates");
  revalidatePath(`/admin/templates/${id}`);
  redirect(`/admin/templates/${id}`);
}

export async function deleteTemplate(id: string): Promise<void> {
  // Delete associated images and jobs first
  await prisma.generationJob.deleteMany({ where: { templateId: id } });
  await prisma.imageAsset.deleteMany({ where: { templateId: id } });
  await prisma.template.delete({ where: { id } });

  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

export async function updateTemplateStatus(
  id: string,
  status: "DRAFT" | "ACTIVE" | "DISABLED"
): Promise<void> {
  await prisma.template.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/templates");
  revalidatePath(`/admin/templates/${id}`);
}
