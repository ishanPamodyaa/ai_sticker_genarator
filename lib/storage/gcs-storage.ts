import { Storage } from "@google-cloud/storage";
import { SIGNED_URL_TTL_MINUTES } from "@/lib/constants";
import type { StorageProvider } from "./types";

export class GCSStorageProvider implements StorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error(
        "GCS_BUCKET_NAME environment variable is required for GCS storage"
      );
    }

    this.bucketName = bucketName;
    this.storage = new Storage();
  }

  async save(buffer: Buffer, relativePath: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(relativePath);

    await file.save(buffer, {
      contentType: "image/png",
      metadata: {
        cacheControl: "private, max-age=3600",
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
      if (error.code !== 404) throw err;
    }
  }

  async getSignedUrl(
    relativePath: string,
    ttlMinutes: number = SIGNED_URL_TTL_MINUTES
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(relativePath);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + ttlMinutes * 60 * 1000,
    });

    return url;
  }
}
