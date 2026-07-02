import type { JsonObject } from "./cms";

export type AuditLog = {
  id: string;
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId?: string;
  before?: JsonObject;
  after?: JsonObject;
  metadata?: JsonObject;
  createdAt: string;
};
