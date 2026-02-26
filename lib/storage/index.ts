import type { StorageProvider } from "./types";
import { LocalStorageProvider } from "./local-storage";
import { GCSStorageProvider } from "./gcs-storage";

export function getStorage(): StorageProvider {
  if (process.env.GCS_BUCKET_NAME) {
    return new GCSStorageProvider();
  }
  return new LocalStorageProvider();
}

export type { StorageProvider } from "./types";
