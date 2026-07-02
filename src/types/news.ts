import type { NewsStatus } from "./cms";

export type CmsNews = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  coverImageId?: string;
  coverImageUrl?: string;
  status: NewsStatus;
  category?: string;
  tags: string[];
  isPinned: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  scheduledFor?: string;
  semesterId?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsInput = {
  title: string;
  slug?: string;
  summary?: string;
  body?: string;
  coverImageId?: string;
  coverImageUrl?: string;
  status?: NewsStatus;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  scheduledFor?: string;
  semesterId?: string;
};
