import { API_ENDPOINTS } from "./apiClient";
import { adminJsonRequest, buildQueryString, readList, readRecord } from "./cmsApiClient";
import type { AuditLog } from "../types/auditLog";

export const getAuditLogs = async (
  params: {
    actor?: string;
    action?: string;
    targetType?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {},
  signal?: AbortSignal,
) =>
  readList<AuditLog>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminAuditLogs}${buildQueryString(params)}`,
      {},
      signal,
    ),
  );

export const getAuditLog = async (id: string, signal?: AbortSignal) =>
  readRecord<AuditLog>(
    await adminJsonRequest(`${API_ENDPOINTS.adminAuditLogs}/${id}`, {}, signal),
  );
