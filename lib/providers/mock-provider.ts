import type {
  ImageProvider,
  GenerationRequest,
  GenerationResult,
  GeneratedImage,
} from "./types";

/**
 * Creates a minimal valid PNG file with a solid color.
 * Uses raw PNG encoding — no external dependencies required.
 */
function createSolidColorPng(
  width: number,
  height: number,
  r: number,
  g: number,
  b: number
): Buffer {
  // For performance, generate a small PNG (64x64) regardless of requested size.
  // Real providers will generate full-size images.
  const w = 64;
  const h = 64;

  // PNG raw image data: filter byte (0) + RGB pixels per row
  const rawData: number[] = [];
  for (let y = 0; y < h; y++) {
    rawData.push(0); // filter byte: None
    for (let x = 0; x < w; x++) {
      rawData.push(r, g, b);
    }
  }

  const rawBuf = Buffer.from(rawData);

  // Compress with zlib deflate (sync, available in Node.js)
  const zlib = require("zlib") as typeof import("zlib");
  const compressed = zlib.deflateSync(rawBuf);

  // Build PNG file
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createPngChunk("IHDR", ihdr);

  // IDAT chunk
  const idatChunk = createPngChunk("IDAT", compressed);

  // IEND chunk
  const iendChunk = createPngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, "ascii");
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf: Buffer): number {
  // Standard CRC-32 used in PNG
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function randomColor(): [number, number, number] {
  // Generate vibrant colors by using HSL-like approach
  const hue = Math.random() * 360;
  const s = 0.7;
  const l = 0.6;

  // HSL to RGB conversion
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export class MockProvider implements ImageProvider {
  readonly providerName = "mock";
  readonly modelName = "mock-v1";

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const images: GeneratedImage[] = [];

    for (let i = 0; i < request.sampleCount; i++) {
      const [r, g, b] = randomColor();
      const buffer = createSolidColorPng(request.width, request.height, r, g, b);
      const seed = `mock-${Date.now()}-${i}`;

      images.push({
        imageBuffer: buffer,
        mimeType: "image/png",
        seed,
        metadata: {
          color: `rgb(${r},${g},${b})`,
          requestedSize: `${request.width}x${request.height}`,
        },
      });
    }

    // Simulate generation delay (500-1500ms)
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    return {
      images,
      provider: this.providerName,
      modelName: this.modelName,
    };
  }
}
