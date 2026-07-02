import type { EditableContent } from "../data/contentData";
import type { JsonObject, PageStatus } from "./cms";

export type CmsPageType = "homepage" | "landing" | "custom";

export type CmsPage = {
  id: string;
  semesterId: string;
  slug: string;
  title: string;
  type: CmsPageType;
  status: PageStatus;
  content: EditableContent | JsonObject;
  createdBy?: string;
  updatedBy?: string;
  publishedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsPageInput = {
  semesterId?: string;
  slug: string;
  title: string;
  type: CmsPageType;
  status?: PageStatus;
  content: EditableContent | JsonObject;
};

export type ContentVersion = {
  id: string;
  pageId?: string;
  semesterId?: string;
  label: string;
  snapshot: EditableContent | JsonObject;
  changeSummary?: string;
  createdBy?: string;
  createdAt: string;
};
