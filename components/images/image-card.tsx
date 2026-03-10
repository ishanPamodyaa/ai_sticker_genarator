import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ImageCardProps {
  image: {
    id: string;
    imageUrl?: string;
    seed?: string | null;
    createdAt: Date;
  };
  showGenerateButton?: boolean;
}

export function ImageCard({ image, showGenerateButton }: ImageCardProps) {
  const src = image.imageUrl || `/api/images/${image.id}`;

  return (
    <Card className="glass-card overflow-hidden group border-none transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1">
      <div className="relative aspect-square p-2">
        <div className="w-full h-full overflow-hidden rounded-xl bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Generated sticker"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        {showGenerateButton && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl m-2">
            <Link
              href={`/client/generate/${image.id}`}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate This Style
            </Link>
          </div>
        )}
      </div>
      {image.seed && (
        <div className="px-4 pb-3 pt-1 text-xs text-muted-foreground truncate opacity-70">
          Seed: {image.seed}
        </div>
      )}
    </Card>
  );
}
