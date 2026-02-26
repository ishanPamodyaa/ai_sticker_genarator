import type { ImageProvider } from "./types";
import { MockProvider } from "./mock-provider";
import { VertexAIProvider } from "./vertex-ai-provider";

export function getProvider(providerName: string, modelName?: string): ImageProvider {
  switch (providerName) {
    case "mock":
      return new MockProvider();
    case "vertex-imagen":
      return new VertexAIProvider(modelName);
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

export type { ImageProvider, GenerationRequest, GenerationResult, GeneratedImage } from "./types";
