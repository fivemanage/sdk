export type ImageUploadResponse = {
  status: string;
  data: {
    id: string;
    url: string;
  };
};

export type ImageUploadOptions = {
  retentionExempt?: boolean;
  path?: string;
  fileName?: string;
  /** Alias for fileName. When both are supplied, fileName takes precedence. */
  filename?: string;
};
