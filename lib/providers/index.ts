import type { ImageProvider } from "./types";
import { MockProvider } from "./mock-provider";

export function getProvider(providerName: string): ImageProvider {
  switch (providerName) {
    case "mock":
      return new MockProvider();
    // Phase 2: case "vertex-imagen": return new VertexAIProvider();
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

export type { ImageProvider, GenerationRequest, GenerationResult, GeneratedImage } from "./types";
