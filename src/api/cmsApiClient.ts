import { readErrorMessage, type ApiRecord } from "./apiClient";

export const readList = <Item>(payload: unknown): Item[] => {
  if (Array.isArray(payload)) return payload as Item[];

  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    const list = record.data ?? record.items ?? record.results;
    if (Array.isArray(list)) return list as Item[];
  }

  return [];
};

export const readRecord = <Item>(payload: unknown): Item => {
  if (payload && typeof payload === "object") {
    const record = payload as ApiRecord;
    return (record.data && typeof record.data === "object"
      ? record.data
      : record) as Item;
  }

  throw new Error("Response did not contain a usable record");
};

export const adminJsonRequest = async <Result>(
  endpoint: string,
  options: RequestInit = {},
  signal?: AbortSignal,
): Promise<Result> => {
  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, `Request failed with ${response.status}`),
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json() as Promise<Result>;
  }

  return undefined as Result;
};

export const buildQueryString = (params: Record<string, string | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  const value = query.toString();
  return value ? `?${value}` : "";
};
