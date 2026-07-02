import type { EditableContent, PageSectionKind } from "../data/contentData";
import type { ValidationResult } from "../types/cms";

const requiredSections: PageSectionKind[] = [
  "hero",
  "about",
  "research",
  "awards",
  "regulations",
  "milestones",
  "news",
  "publications",
  "workshops",
  "footer",
];

const addError = (
  errors: Record<string, string>,
  field: string,
  message: string,
) => {
  errors[field] = message;
};

export const validatePageContentInput = (
  content: Partial<EditableContent> | null | undefined,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!content || typeof content !== "object") {
    return {
      valid: false,
      errors: { content: "Page content is required." },
    };
  }

  if (!Array.isArray(content.layout) || content.layout.length === 0) {
    addError(errors, "layout", "At least one page section is required.");
  } else {
    const ids = new Set(content.layout.map((section) => section.id));
    requiredSections.forEach((sectionId) => {
      if (!ids.has(sectionId)) {
        addError(errors, `layout.${sectionId}`, `${sectionId} section is missing.`);
      }
    });
  }

  if (!content.hero?.titleLines?.some((line) => line.trim())) {
    addError(errors, "hero.titleLines", "Hero title is required.");
  }

  if (!content.about?.title?.trim()) {
    addError(errors, "about.title", "About title is required.");
  }

  if (!content.footer?.email?.trim()) {
    addError(errors, "footer.email", "Footer email is required.");
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
