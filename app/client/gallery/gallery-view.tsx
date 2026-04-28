"use client";

import { useState } from "react";
import { ImageGrid } from "@/components/images/image-grid";
import { Select } from "@/components/ui/select";

interface ImageProps {
  id: string;
  imageUrl?: string;
  seed?: string | null;
  createdAt: Date;
}

interface GalleryViewProps {
  groupedSamples: Record<string, ImageProps[]>;
  sortedCategories: string[];
}

export function GalleryView({ groupedSamples, sortedCategories }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categoriesToRender =
    selectedCategory === "All" ? sortedCategories : [selectedCategory];

  return (
    <div className="animate-slide-up relative z-10 space-y-8">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-card/60 backdrop-blur-xl border border-white/10 p-4 sm:px-6 rounded-2xl shadow-lg shadow-black/5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Filter Stickers</h2>
          <p className="text-sm text-muted-foreground hidden sm:block">Choose a template style below</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:w-64">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background/50 border-white/10"
          >
            <option value="All">All Categories</option>
            {sortedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Categories output */}
      <div className="space-y-12">
        {categoriesToRender.map((category) => {
          const images = groupedSamples[category];
          // Fallback if category has no images (e.g. state issues)
          if (!images || images.length === 0) return null;

          return (
            <div key={category} className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight inline-block relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  {category}
                </span>
                <div className="absolute -bottom-2 left-0 w-1/3 h-[2px] bg-gradient-to-r from-violet-500 to-transparent" />
              </h3>
              <ImageGrid images={images} showGenerateButton />
            </div>
          );
        })}
      </div>
    </div>
  );
}
