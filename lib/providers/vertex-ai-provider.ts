import type {
  ImageProvider,
  GenerationRequest,
  GenerationResult,
  GeneratedImage,
} from "./types";

/**
 * Google AI Imagen provider using the Gemini REST API with an API key.
 * Supports Imagen 3 and Imagen 4 model families.
 *
 * Docs: https://ai.google.dev/gemini-api/docs/imagen
 */
export class VertexAIProvider implements ImageProvider {
  readonly providerName = "vertex-imagen";
  readonly modelName: string;

  private apiKey: string;

  constructor(modelName?: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is required for Imagen provider"
      );
    }

    this.apiKey = apiKey;
    const defaultModel = "imagen-4.0-generate-001";
    if (!modelName || modelName.toLowerCase() === "imagen") {
      this.modelName = defaultModel;
    } else {
      this.modelName = modelName;
    }
  }

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:predict`;

    const parameters: Record<string, unknown> = {
      sampleCount: request.sampleCount,
      aspectRatio: getAspectRatio(request.width, request.height),
    };

    // negativePrompt is only supported by Imagen 3, not Imagen 4
    if (request.negativePrompt && !this.modelName.startsWith("imagen-4")) {
      parameters.negativePrompt = request.negativePrompt;
    }

    // Merge any extra config from template
    if (request.configJson) {
      Object.assign(parameters, request.configJson);
    }

    const body = {
      instances: [{ prompt: request.prompt }],
      parameters,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Imagen API error (${res.status}): ${text}`);
    }

    const data = (await res.json()) as {
      predictions?: Array<{
        bytesBase64Encoded?: string;
        mimeType?: string;
        raiFilteredReason?: string;
      }>;
    };

    const images: GeneratedImage[] = [];

    if (data.predictions) {
      for (const prediction of data.predictions) {
        if (prediction.raiFilteredReason) {
          console.warn(
            `[imagen] Image filtered: ${prediction.raiFilteredReason}`
          );
          continue;
        }

        const b64Data = prediction.bytesBase64Encoded;
        if (!b64Data) continue;

        images.push({
          imageBuffer: Buffer.from(b64Data, "base64"),
          mimeType: "image/png",
          metadata: {
            mimeType: prediction.mimeType ?? "image/png",
          },
        });
      }
    }

    if (images.length === 0) {
      throw new Error(
        "Imagen returned no images. The prompt may have been blocked by safety filters."
      );
    }

    return {
      images,
      provider: this.providerName,
      modelName: this.modelName,
    };
  }
}

/**
 * Convert pixel dimensions to the closest supported aspect ratio.
 * Supported: "1:1", "9:16", "16:9", "3:4", "4:3"
 */
function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  const ratios = [
    { value: "1:1", numeric: 1 },
    { value: "16:9", numeric: 16 / 9 },
    { value: "9:16", numeric: 9 / 16 },
    { value: "4:3", numeric: 4 / 3 },
    { value: "3:4", numeric: 3 / 4 },
  ];

  let closest = ratios[0];
  let minDiff = Math.abs(ratio - closest.numeric);

  for (const r of ratios) {
    const diff = Math.abs(ratio - r.numeric);
    if (diff < minDiff) {
      minDiff = diff;
      closest = r;
    }
  }

  return closest.value;
}
