export type MediaAsset = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  tags: string[];
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaAssetInput = {
  altText?: string;
  caption?: string;
  tags?: string[];
};
