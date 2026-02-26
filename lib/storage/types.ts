export interface StorageProvider {
  save(buffer: Buffer, relativePath: string): Promise<string>;
  getBuffer(relativePath: string): Promise<Buffer>;
  delete(relativePath: string): Promise<void>;
  getPublicUrl?(relativePath: string): string;
}
