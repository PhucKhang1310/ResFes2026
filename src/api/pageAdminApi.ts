import { API_ENDPOINTS } from "./apiClient";
import { adminJsonRequest, buildQueryString, readList, readRecord } from "./cmsApiClient";
import type { PageStatus } from "../types/cms";
import type { CmsPage, CmsPageInput } from "../types/page";

type AdminPagePayload = { data?: unknown; items?: unknown; results?: unknown };

export const getAdminPages = async (
  params: { semesterId?: string; status?: PageStatus } = {},
  signal?: AbortSignal,
) => {
  const payload = await adminJsonRequest<AdminPagePayload>(
    `${API_ENDPOINTS.adminPages}${buildQueryString(params)}`,
    {},
    signal,
  );
  return readList<CmsPage>(payload);
};

export const getAdminPage = async (pageId: string, signal?: AbortSignal) =>
  readRecord<CmsPage>(
    await adminJsonRequest(`${API_ENDPOINTS.adminPages}/${pageId}`, {}, signal),
  );

export const createDraftPage = async (
  payload: CmsPageInput,
  signal?: AbortSignal,
) =>
  readRecord<CmsPage>(
    await adminJsonRequest(
      API_ENDPOINTS.adminPages,
      { method: "POST", body: JSON.stringify(payload) },
      signal,
    ),
  );

export const updateDraftPage = async (
  pageId: string,
  payload: Partial<CmsPageInput>,
  signal?: AbortSignal,
) =>
  readRecord<CmsPage>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminPages}/${pageId}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      signal,
    ),
  );

const postPageAction = async (pageId: string, action: string, signal?: AbortSignal) =>
  readRecord<CmsPage>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminPages}/${pageId}/${action}`,
      { method: "POST" },
      signal,
    ),
  );

export const submitPageForReview = (pageId: string, signal?: AbortSignal) =>
  postPageAction(pageId, "submit-review", signal);

export const publishPage = (pageId: string, signal?: AbortSignal) =>
  postPageAction(pageId, "publish", signal);

export const archivePage = (pageId: string, signal?: AbortSignal) =>
  postPageAction(pageId, "archive", signal);

export const getPagePreview = async (pageId: string, signal?: AbortSignal) =>
  readRecord<CmsPage>(
    await adminJsonRequest(`${API_ENDPOINTS.adminPages}/${pageId}/preview`, {}, signal),
  );

export const getPublishedHomepage = async (
  params: { semesterSlug?: string } = {},
  signal?: AbortSignal,
) => {
  const endpoint = params.semesterSlug
    ? `${API_ENDPOINTS.semesterHomepage}/${params.semesterSlug}/homepage`
    : API_ENDPOINTS.currentHomepage;

  return readRecord<CmsPage>(await adminJsonRequest(endpoint, {}, signal));
};
