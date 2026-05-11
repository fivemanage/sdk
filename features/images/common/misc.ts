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
  filename?: string;
};
