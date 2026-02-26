import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";

interface ImageCardProps {
  image: {
    id: string;
    seed?: string | null;
    createdAt: Date;
  };
  showGenerateButton?: boolean;
}

export function ImageCard({ image, showGenerateButton }: ImageCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(image.id)}
          alt="Generated sticker"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {showGenerateButton && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link
              href={`/generate/${image.id}`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Generate Similar
            </Link>
          </div>
        )}
      </div>
      {image.seed && (
        <div className="p-2 text-xs text-muted-foreground truncate">
          Seed: {image.seed}
        </div>
      )}
    </Card>
  );
}
