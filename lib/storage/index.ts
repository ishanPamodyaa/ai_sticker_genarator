import type { StorageProvider } from "./types";
import { LocalStorageProvider } from "./local-storage";

export function getStorage(): StorageProvider {
  // Phase 2: check env for GCS config and return GCSStorageProvider
  return new LocalStorageProvider();
}

export type { StorageProvider } from "./types";
