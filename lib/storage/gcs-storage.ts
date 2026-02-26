import { Storage } from "@google-cloud/storage";
import type { StorageProvider } from "./types";

export class GCSStorageProvider implements StorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("GCS_BUCKET_NAME environment variable is required for GCS storage");
    }

    this.bucketName = bucketName;

    // Uses Application Default Credentials (ADC) or
    // GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account key
    this.storage = new Storage();
  }

  async save(buffer: Buffer, relativePath: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(relativePath);

    await file.save(buffer, {
      contentType: "image/png",
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    return relativePath;
  }

  async getBuffer(relativePath: string): Promise<Buffer> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(relativePath);
    const [contents] = await file.download();
    return contents;
  }

  async delete(relativePath: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(relativePath);
    try {
      await file.delete();
    } catch (err) {
      const error = err as { code?: number };
      // Ignore 404 (file doesn't exist)
      if (error.code !== 404) throw err;
    }
  }

  getPublicUrl(relativePath: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${relativePath}`;
  }
}
