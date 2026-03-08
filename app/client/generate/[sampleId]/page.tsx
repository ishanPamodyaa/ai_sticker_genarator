import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { SubjectPromptForm } from "@/components/generation/subject-prompt-form";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ sampleId: string }>;
}) {
  const { sampleId } = await params;

  const sample = await prisma.generatedImage.findUnique({
    where: { id: sampleId },
    include: {
      template: { select: { name: true, basePrompt: true, width: true, height: true } },
    },
  });

  if (!sample || sample.type !== "SAMPLE" || sample.status !== "ACTIVE") {
    notFound();
  }

  const storage = getStorage();
  const imageUrl = await storage.getSignedUrl(sample.gcsPath);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate Your Sticker</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="w-48 h-48 rounded-lg overflow-hidden border flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Sample sticker"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg">{sample.template.name}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                This template uses a style prompt to generate stickers. Enter your subject below to create a unique sticker.
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground mt-3">
                <span>{sample.template.width}x{sample.template.height}px</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubjectPromptForm sampleId={sample.id} />
    </div>
  );
}
