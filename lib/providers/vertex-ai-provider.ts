import { v1 } from "@google-cloud/aiplatform";
import type {
  ImageProvider,
  GenerationRequest,
  GenerationResult,
  GeneratedImage,
} from "./types";

const { PredictionServiceClient } = v1;

interface VertexAIConfig {
  projectId: string;
  location: string;
  /** e.g. "imagen-3.0-generate-002" or "imagegeneration@006" */
  modelName: string;
}

function getConfig(): VertexAIConfig {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";

  if (!projectId) {
    throw new Error(
      "GOOGLE_CLOUD_PROJECT environment variable is required for Vertex AI provider"
    );
  }

  return { projectId, location, modelName: "" };
}

export class VertexAIProvider implements ImageProvider {
  readonly providerName = "vertex-imagen";
  readonly modelName: string;

  private client: InstanceType<typeof PredictionServiceClient>;
  private endpoint: string;

  constructor(modelName?: string) {
    const config = getConfig();
    this.modelName = modelName || "imagen-3.0-generate-002";

    // The client uses Application Default Credentials (ADC) or
    // GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account key
    this.client = new PredictionServiceClient({
      apiEndpoint: `${config.location}-aiplatform.googleapis.com`,
    });

    this.endpoint = `projects/${config.projectId}/locations/${config.location}/publishers/google/models/${this.modelName}`;
  }

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const instances = [
      {
        structValue: {
          fields: {
            prompt: { stringValue: request.prompt },
          },
        },
      },
    ];

    const parameters: Record<string, { numberValue?: number; stringValue?: string }> = {
      sampleCount: { numberValue: request.sampleCount },
    };

    // Imagen 3 uses aspectRatio instead of width/height
    if (this.modelName.startsWith("imagen-3")) {
      const aspectRatio = getAspectRatio(request.width, request.height);
      parameters.aspectRatio = { stringValue: aspectRatio };
    }

    if (request.negativePrompt) {
      parameters.negativePrompt = { stringValue: request.negativePrompt };
    }

    // Add any extra config from template
    if (request.configJson) {
      for (const [key, value] of Object.entries(request.configJson)) {
        if (typeof value === "number") {
          parameters[key] = { numberValue: value };
        } else if (typeof value === "string") {
          parameters[key] = { stringValue: value };
        }
      }
    }

    const parametersValue = {
      structValue: {
        fields: Object.fromEntries(
          Object.entries(parameters).map(([k, v]) => [k, v])
        ),
      },
    };

    const [response] = await this.client.predict({
      endpoint: this.endpoint,
      instances,
      parameters: parametersValue,
    });

    const images: GeneratedImage[] = [];

    if (response.predictions) {
      for (const prediction of response.predictions) {
        const fields = prediction.structValue?.fields;
        if (!fields) continue;

        const b64Data = fields.bytesBase64Encoded?.stringValue;
        if (!b64Data) continue;

        const imageBuffer = Buffer.from(b64Data, "base64");

        images.push({
          imageBuffer,
          mimeType: "image/png",
          seed: fields.seed?.stringValue ?? undefined,
          metadata: {
            mimeType: fields.mimeType?.stringValue ?? "image/png",
          },
        });
      }
    }

    if (images.length === 0) {
      throw new Error(
        "Vertex AI returned no images. The prompt may have been blocked by safety filters."
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
 * Convert pixel dimensions to the closest supported Imagen 3 aspect ratio.
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
