import { API_ENDPOINTS, submitJson } from "./apiClient";

export type RegistrationSubmissionPayload = {
  name: string;
  email: string;
  topic: string;
  field: string;
  mentor: string;
  turnstileToken: string;
};

export type RegistrationSubmissionResponse = {
  message: string;
  registrationId: string;
};

export const submitRegistration = (
  payload: RegistrationSubmissionPayload,
  signal?: AbortSignal,
  idempotencyKey?: string,
) =>
  submitJson(API_ENDPOINTS.registration, payload, signal, idempotencyKey) as Promise<RegistrationSubmissionResponse>;
