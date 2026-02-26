import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";
import { GenerateFromSampleButton } from "@/components/images/generate-button";

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ sampleId: string }>;
}) {
  const { sampleId } = await params;

  const sample = await prisma.imageAsset.findUnique({
    where: { id: sampleId },
    include: {
      template: { select: { name: true, prompt: true, width: true, height: true } },
    },
  });

  if (!sample || sample.type !== "SAMPLE" || sample.status !== "ACTIVE") {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate Similar Sticker</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="w-48 h-48 rounded-lg overflow-hidden border flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(sample.id)}
                alt="Sample sticker"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg">{sample.template.name}</h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {sample.template.prompt}
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground mt-3">
                <span>{sample.template.width}x{sample.template.height}px</span>
                {sample.seed && <span>Seed: {sample.seed}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground mb-4">
        A new unique sticker will be generated using the same template and settings as the sample above.
      </p>

      <GenerateFromSampleButton sampleId={sample.id} />
    </div>
  );
}
