export const MOCK_PROVIDER = "mock" as const;
export const DEFAULT_WIDTH = 1024;
export const DEFAULT_HEIGHT = 1024;
export const DEFAULT_SAMPLE_COUNT = 4;
export const ALLOWED_SIZES = [512, 768, 1024] as const;
export const JOB_POLL_INTERVAL_MS = 2000;
export const DAILY_GENERATION_LIMIT = 20;
export const SIGNED_URL_TTL_MINUTES = 60;

export const PROVIDER_OPTIONS = [
  { value: "mock", label: "Mock Provider" },
  { value: "vertex-imagen", label: "Google Vertex AI (Imagen)" },
] as const;

export const STATUS_LABELS = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  DISABLED: "Disabled",
  QUEUED: "Queued",
  RUNNING: "Running",
  SUCCESS: "Success",
  FAILED: "Failed",
  SAMPLE: "Sample",
  GENERATED: "Generated",
  HIDDEN: "Hidden",
  DELETED: "Deleted",
} as const;
