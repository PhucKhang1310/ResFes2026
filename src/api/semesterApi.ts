import { API_ENDPOINTS } from "./apiClient";
import { adminJsonRequest, readList, readRecord } from "./cmsApiClient";
import type { Semester, SemesterInput } from "../types/semester";

export const getAdminSemesters = async (signal?: AbortSignal) =>
  readList<Semester>(
    await adminJsonRequest(API_ENDPOINTS.adminSemesters, {}, signal),
  );

export const getAdminSemester = async (id: string, signal?: AbortSignal) =>
  readRecord<Semester>(
    await adminJsonRequest(`${API_ENDPOINTS.adminSemesters}/${id}`, {}, signal),
  );

export const createSemester = async (
  payload: SemesterInput,
  signal?: AbortSignal,
) =>
  readRecord<Semester>(
    await adminJsonRequest(
      API_ENDPOINTS.adminSemesters,
      { method: "POST", body: JSON.stringify(payload) },
      signal,
    ),
  );

export const updateSemester = async (
  id: string,
  payload: Partial<SemesterInput>,
  signal?: AbortSignal,
) =>
  readRecord<Semester>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminSemesters}/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      signal,
    ),
  );

const postSemesterAction = async (id: string, action: string, signal?: AbortSignal) =>
  readRecord<Semester>(
    await adminJsonRequest(
      `${API_ENDPOINTS.adminSemesters}/${id}/${action}`,
      { method: "POST" },
      signal,
    ),
  );

export const activateSemester = (id: string, signal?: AbortSignal) =>
  postSemesterAction(id, "activate", signal);

export const archiveSemester = (id: string, signal?: AbortSignal) =>
  postSemesterAction(id, "archive", signal);

export const duplicateSemester = (id: string, signal?: AbortSignal) =>
  postSemesterAction(id, "duplicate", signal);
