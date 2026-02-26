import * as fs from "fs/promises";
import * as path from "path";
import type { StorageProvider } from "./types";

export class LocalStorageProvider implements StorageProvider {
  private basePath: string;

  constructor() {
    this.basePath = path.join(process.cwd(), "data", "images");
  }

  async save(buffer: Buffer, relativePath: string): Promise<string> {
    const fullPath = path.join(this.basePath, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    return relativePath;
  }

  async getBuffer(relativePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, relativePath);
    return fs.readFile(fullPath);
  }

  async delete(relativePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      // Ignore if file doesn't exist
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
}
