import type { ValidationResult } from "../types/cms";
import type { NewsInput } from "../types/news";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateNewsInput = (
  input: Partial<NewsInput> | null | undefined,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!input) {
    return { valid: false, errors: { news: "News input is required." } };
  }

  if (!input.title?.trim()) {
    errors.title = "Title is required.";
  }

  if (!input.slug?.trim()) {
    errors.slug = "Slug is required.";
  } else if (!slugPattern.test(input.slug.trim())) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens.";
  }

  if (!input.body?.trim()) {
    errors.body = "Body is required.";
  }

  if (input.status === "scheduled" && !input.scheduledFor) {
    errors.scheduledFor = "Scheduled date is required.";
  }

  if (input.scheduledFor) {
    const scheduledFor = new Date(input.scheduledFor);
    if (Number.isNaN(scheduledFor.getTime())) {
      errors.scheduledFor = "Scheduled date is invalid.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
