import { API_ENDPOINTS, readErrorMessage } from "./apiClient";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  semesterId?: string;
};

export type AnalyticsSummary = {
  filters: {
    from: string | null;
    to: string | null;
    semesterId: string | null;
  };
  totals: {
    publications: number;
    researchers: number;
    publishedNews: number;
    registrations: number;
    pendingPublications: number;
    pendingResearchers: number;
    cmsPages: number;
  };
  content: {
    activeSections: number;
    inactiveSections: number;
  };
  unavailable: {
    visits: "not_collected";
    searches: "not_collected";
  };
  generatedAt: string;
};

const buildAnalyticsUrl = (path: string, filters: AnalyticsFilters) => {
  const url = new URL(`${API_ENDPOINTS.adminAnalytics}${path}`);
  if (filters.from) url.searchParams.set("from", filters.from);
  if (filters.to) url.searchParams.set("to", filters.to);
  if (filters.semesterId) url.searchParams.set("semesterId", filters.semesterId);
  return url.toString();
};

export const fetchAnalyticsSummary = async (
  filters: AnalyticsFilters = {},
  signal?: AbortSignal,
): Promise<AnalyticsSummary> => {
  const response = await fetch(buildAnalyticsUrl("/summary", filters), {
    credentials: "include",
    signal,
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Analytics request failed with ${response.status}`),
    );
  }

  const payload = (await response.json()) as { data: AnalyticsSummary };
  return payload.data;
};

export const downloadAnalyticsCsv = async (filters: AnalyticsFilters = {}) => {
  const response = await fetch(buildAnalyticsUrl("/export.csv", filters), {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Analytics export failed with ${response.status}`),
    );
  }

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "src2026-analytics.csv";
  link.click();
  URL.revokeObjectURL(blobUrl);
};
