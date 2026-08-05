import {
  API_ENDPOINTS,
  fetchWithRetry,
  readErrorMessage,
  readString,
  type ApiRecord,
} from "./apiClient";
import { createBrowserCache } from "./browserCache";

export type NewsRecord = {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  summary?: string;
  thumbNailImage: string;
  images: string[];
  date: string;
  content: string;
  body?: string;
  author: string;
  coverImageId?: string;
  coverImageUrl?: string;
  status?: "draft" | "review" | "scheduled" | "published" | "archived";
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  scheduledFor?: string;
  semesterId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsSubmissionPayload = {
  title: string;
  slug?: string;
  description: string;
  summary?: string;
  thumbNailImage: string;
  images: string[];
  date: string;
  content: string;
  body?: string;
  author: string;
  coverImageId?: string;
  coverImageUrl?: string;
  status?: NewsRecord["status"];
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  scheduledFor?: string;
  semesterId?: string;
  thumbNailImageFile?: File | null;
  imageFiles?: File[];
};

const NEWS_CACHE_TTL = 5 * 60 * 1000;

const getNewsRecords = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const wrappedList = record.news ?? record.data ?? record.items ?? record.results;

    if (Array.isArray(wrappedList)) {
      return wrappedList;
    }
  }

  return [];
};

const normalizeNewsRecords = (payload: unknown): NewsRecord[] =>
  getNewsRecords(payload)
    .map<NewsRecord | null>((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as ApiRecord;
      const id = readString(record, ["_id", "id"]);
      const images = Array.isArray(record.images)
        ? record.images.filter((image): image is string => typeof image === "string")
        : [];
      const tags = Array.isArray(record.tags)
        ? record.tags.filter((tag): tag is string => typeof tag === "string")
        : [];

      if (!id) {
        return null;
      }

      return {
        _id: id,
        title: readString(record, ["title"]),
        slug: readString(record, ["slug"]),
        description: readString(record, ["description"]),
        summary: readString(record, ["summary"]),
        thumbNailImage: readString(record, ["thumbNailImage", "thumbnailImage"]),
        images,
        date: readString(record, ["date"]),
        content: readString(record, ["content"]),
        body: readString(record, ["body"]),
        author: readString(record, ["author"]),
        coverImageId: readString(record, ["coverImageId"]),
        coverImageUrl: readString(record, ["coverImageUrl"]),
        status: readString(record, ["status"]) as NewsRecord["status"],
        category: readString(record, ["category"]),
        tags,
        isPinned: record.isPinned === true,
        isFeatured: record.isFeatured === true,
        seoTitle: readString(record, ["seoTitle"]),
        seoDescription: readString(record, ["seoDescription"]),
        publishedAt: readString(record, ["publishedAt"]),
        scheduledFor: readString(record, ["scheduledFor"]),
        semesterId: readString(record, ["semesterId"]),
        createdAt: readString(record, ["createdAt"]),
        updatedAt: readString(record, ["updatedAt"]),
      };
    })
    .filter((news): news is NewsRecord => Boolean(news));

const normalizeNewsRecord = (payload: unknown): NewsRecord | null => {
  const records = normalizeNewsRecords(payload);
  if (records[0]) {
    return records[0];
  }

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    if (record.data && typeof record.data === "object") {
      return normalizeNewsRecords([record.data])[0] ?? null;
    }
  }

  return null;
};

const newsCache = createBrowserCache<NewsRecord[]>({
  cacheName: "resfes-news-v1",
  normalize: (data) => normalizeNewsRecords(data),
  requestUrl: API_ENDPOINTS.news,
  storageKey: "resfes-news",
  ttlMs: NEWS_CACHE_TTL,
});

export const clearNewsCache = () => newsCache.clear();

export const fetchNews = async (
  signal?: AbortSignal,
  options: { forceRefresh?: boolean } = {},
) => {
  if (!options.forceRefresh) {
    const cachedNews = await newsCache.read();
    if (cachedNews) {
      return cachedNews;
    }
  }

  const response = await fetchWithRetry(API_ENDPOINTS.news, { signal });

  if (!response.ok) {
    throw new Error(`News request failed with ${response.status}`);
  }

  const news = normalizeNewsRecords(await response.json());
  await newsCache.write(news);
  return news;
};

export const getNews = fetchNews;

export const fetchNewsById = async (id: string, signal?: AbortSignal) => {
  const cachedNews = await newsCache.read();
  const cachedItem = cachedNews?.find((item) => item._id === decodeURIComponent(id));
  if (cachedItem) {
    return cachedItem;
  }

  const response = await fetchWithRetry(`${API_ENDPOINTS.news}/${id}`, { signal });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News request failed with ${response.status}`));
  }

  const news = normalizeNewsRecord(await response.json());

  if (!news) {
    throw new Error("News response did not contain a usable record");
  }

  const nextNews = cachedNews
    ? [
      news,
      ...cachedNews.filter((cachedItem) => cachedItem._id !== news._id),
    ]
    : [news];
  await newsCache.write(nextNews);

  return news;
};

export const fetchAdminNews = async (signal?: AbortSignal) => {
  const response = await fetchWithRetry(API_ENDPOINTS.adminNews, {
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Admin news request failed with ${response.status}`));
  }

  return normalizeNewsRecords(await response.json());
};

export const fetchAdminNewsById = async (id: string, signal?: AbortSignal) => {
  const response = await fetchWithRetry(
    `${API_ENDPOINTS.adminNews}/${encodeURIComponent(id)}`,
    {
      credentials: "include",
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Admin news request failed with ${response.status}`));
  }

  const news = normalizeNewsRecord(await response.json());

  if (!news) {
    throw new Error("News response did not contain a usable record");
  }

  return news;
};

export const fetchRelatedNews = async (
  id: string,
  signal?: AbortSignal,
  limit = 3,
) => {
  const encodedId = encodeURIComponent(id);
  const response = await fetchWithRetry(
    `${API_ENDPOINTS.news}/${encodedId}/related?limit=${limit}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Related news request failed with ${response.status}`));
  }

  return normalizeNewsRecords(await response.json());
};

const buildNewsFormData = (payload: NewsSubmissionPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  if (payload.slug) formData.append("slug", payload.slug);
  formData.append("description", payload.description);
  if (payload.summary) formData.append("summary", payload.summary);
  formData.append("date", payload.date);
  formData.append("content", payload.content);
  if (payload.body) formData.append("body", payload.body);
  formData.append("author", payload.author);
  if (payload.coverImageId) formData.append("coverImageId", payload.coverImageId);
  if (payload.coverImageUrl) formData.append("coverImageUrl", payload.coverImageUrl);
  if (payload.status) formData.append("status", payload.status);
  if (payload.category) formData.append("category", payload.category);
  if (payload.tags) formData.append("tags", payload.tags.join(","));
  formData.append("isPinned", String(payload.isPinned ?? false));
  formData.append("isFeatured", String(payload.isFeatured ?? false));
  if (payload.seoTitle) formData.append("seoTitle", payload.seoTitle);
  if (payload.seoDescription) formData.append("seoDescription", payload.seoDescription);
  if (payload.publishedAt) formData.append("publishedAt", payload.publishedAt);
  if (payload.scheduledFor) formData.append("scheduledFor", payload.scheduledFor);
  if (payload.semesterId) formData.append("semesterId", payload.semesterId);

  if (payload.thumbNailImageFile) {
    formData.append("thumbNailImage", payload.thumbNailImageFile);
  } else if (payload.thumbNailImage) {
    formData.append("thumbNailImage", payload.thumbNailImage);
  }

  formData.append("images", payload.images.join(","));

  payload.imageFiles?.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
};

export const submitNews = async (
  payload: NewsSubmissionPayload,
  signal?: AbortSignal,
) => {
  const response = await fetch(API_ENDPOINTS.news, {
    method: "POST",
    credentials: "include",
    body: buildNewsFormData(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News submission failed with ${response.status}`));
  }

  const result = (await response.json()) as { message: string; data: NewsRecord };
  await clearNewsCache();
  return result;
};

export const updateNews = async (
  id: string,
  payload: NewsSubmissionPayload,
  signal?: AbortSignal,
) => {
  const response = await fetch(`${API_ENDPOINTS.news}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: buildNewsFormData(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `News update failed with ${response.status}`));
  }

  const result = (await response.json()) as { message: string; data: NewsRecord };
  await clearNewsCache();
  return result;
};
