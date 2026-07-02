export type PageStatus = "draft" | "review" | "published" | "archived";

export type SemesterStatus = "draft" | "active" | "archived";

export type NewsStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export type JsonObject = Record<string, unknown>;
