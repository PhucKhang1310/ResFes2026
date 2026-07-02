import { API_ENDPOINTS } from "./apiClient";
import { adminJsonRequest, buildQueryString, readList, readRecord } from "./cmsApiClient";
import type { MediaAsset, MediaAssetInput } from "../types/media";

export const getMediaAssets = async (
  params: { search?: string; mimeType?: string; tag?: string } = {},
  signal?: AbortSignal,
) =>
  readList<MediaAsset>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminMedia}${buildQueryString(params)}`,
      {},
      signal,
    ),
  );

export const uploadMediaAsset = async (
  file: File,
  metadata: MediaAssetInput = {},
  signal?: AbortSignal,
) => {
  const body = new FormData();
  body.append("file", file);
  body.append("metadata", JSON.stringify(metadata));

  const response = await fetch(API_ENDPOINTS.adminMedia, {
    method: "POST",
    credentials: "include",
    body,
    signal,
  });

  if (!response.ok) {
    throw new Error(`Media upload failed with ${response.status}`);
  }

  return readRecord<MediaAsset>(await response.json());
};

export const updateMediaAsset = async (
  id: string,
  payload: MediaAssetInput,
  signal?: AbortSignal,
) =>
  readRecord<MediaAsset>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminMedia}/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      signal,
    ),
  );

export const deleteMediaAsset = async (id: string, signal?: AbortSignal) =>
  adminJsonRequest<{ message: string }>(
    `${API_ENDPOINTS.adminMedia}/${id}`,
    { method: "DELETE" },
    signal,
  );

export const getMediaAssetUsages = async (id: string, signal?: AbortSignal) =>
  readList(
    await adminJsonRequest(`${API_ENDPOINTS.adminMedia}/${id}/usages`, {}, signal),
  );
