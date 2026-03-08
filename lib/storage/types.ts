export interface StorageProvider {
  save(buffer: Buffer, relativePath: string): Promise<string>;
  getBuffer(relativePath: string): Promise<Buffer>;
  delete(relativePath: string): Promise<void>;
  getSignedUrl(relativePath: string, ttlMinutes?: number): Promise<string>;
}
