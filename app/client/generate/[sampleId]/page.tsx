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
    <div className="container mx-auto px-4 py-12 relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Generate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Sticker</span>
          </h1>
          <p className="text-muted-foreground mt-2">Customize this style with your own subject</p>
        </div>

        <Card className="glass-card mb-8 border-none shadow-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
          <div className="bg-background/40 backdrop-blur-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                <div className="w-48 h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0 bg-white/5 relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Sample sticker"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h2 className="font-bold text-2xl text-foreground mb-2">{sample.template.name}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    This template uses a style prompt to generate stickers. Enter your subject below to create a unique sticker.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground font-medium shadow-inner">
                    <span>{sample.template.width} × {sample.template.height}px</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="glass-card p-6 md:p-8 rounded-2xl border-none shadow-2xl relative overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
          <SubjectPromptForm sampleId={sample.id} />
        </div>
      </div>
    </div>
  );
}
