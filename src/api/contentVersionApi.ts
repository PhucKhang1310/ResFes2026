import { API_ENDPOINTS } from "./apiClient";
import { adminJsonRequest, readList, readRecord } from "./cmsApiClient";
import type { ContentVersionSummary } from "./pageContentApi";

export type VersionDiffItem = {
  field: string;
  before: unknown;
  after: unknown;
};

export const getPageVersions = async (_pageId?: string, signal?: AbortSignal) =>
  readList<ContentVersionSummary>(
    await adminJsonRequest(API_ENDPOINTS.contentVersions, {}, signal),
  );

export const getPageVersion = async (_pageId: string, versionId: string, signal?: AbortSignal) =>
  readRecord<ContentVersionSummary>(
    await adminJsonRequest(`${API_ENDPOINTS.contentVersions}/${versionId}`, {}, signal),
  );

export const restorePageVersionAsDraft = async (
  _pageId: string,
  versionId: string,
  signal?: AbortSignal,
) =>
  readRecord<ContentVersionSummary>(
    await adminJsonRequest(
      `${API_ENDPOINTS.contentVersions}/${versionId}/restore-draft`,
      { method: "POST" },
      signal,
    ),
  );

export const getPageVersionDiff = async (
  _pageId: string,
  versionId: string,
  signal?: AbortSignal,
) =>
  readList<VersionDiffItem>(
    await adminJsonRequest(
      `${API_ENDPOINTS.contentVersions}/${versionId}/diff`,
      {},
      signal,
    ),
  );
