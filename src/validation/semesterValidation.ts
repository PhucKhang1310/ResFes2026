import type { ValidationResult } from "../types/cms";
import type { SemesterInput } from "../types/semester";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateSemesterInput = (
  input: Partial<SemesterInput> | null | undefined,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!input) {
    return { valid: false, errors: { semester: "Semester input is required." } };
  }

  if (!input.code?.trim()) {
    errors.code = "Code is required.";
  }

  if (!input.name?.trim()) {
    errors.name = "Name is required.";
  }

  if (!input.slug?.trim()) {
    errors.slug = "Slug is required.";
  } else if (!slugPattern.test(input.slug.trim())) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens.";
  }

  if (!input.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!input.endDate) {
    errors.endDate = "End date is required.";
  }

  if (input.startDate && input.endDate) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (Number.isNaN(start.getTime())) {
      errors.startDate = "Start date is invalid.";
    }

    if (Number.isNaN(end.getTime())) {
      errors.endDate = "End date is invalid.";
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start >= end) {
      errors.endDate = "End date must be after start date.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
