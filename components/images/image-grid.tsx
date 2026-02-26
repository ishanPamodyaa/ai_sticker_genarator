import { ImageCard } from "./image-card";

interface ImageGridProps {
  images: Array<{
    id: string;
    seed?: string | null;
    createdAt: Date;
  }>;
  showGenerateButton?: boolean;
}

export function ImageGrid({ images, showGenerateButton }: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          showGenerateButton={showGenerateButton}
        />
      ))}
    </div>
  );
}
