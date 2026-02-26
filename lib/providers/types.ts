export interface GenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  sampleCount: number;
  seed?: string;
  configJson?: Record<string, unknown>;
}

export interface GeneratedImage {
  imageBuffer: Buffer;
  mimeType: "image/png";
  seed?: string;
  metadata?: Record<string, unknown>;
}

export interface GenerationResult {
  images: GeneratedImage[];
  provider: string;
  modelName: string;
}

export interface ImageProvider {
  readonly providerName: string;
  readonly modelName: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
}
