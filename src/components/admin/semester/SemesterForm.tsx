import { useState, type FormEvent } from "react";
import { FaFloppyDisk } from "react-icons/fa6";
import { validateSemesterInput } from "../../../validation/semesterValidation";
import type { SemesterInput } from "../../../types/semester";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const defaultValue: SemesterInput = {
  code: "",
  name: "",
  slug: "",
  status: "draft",
  startDate: "",
  endDate: "",
  description: "",
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SemesterForm = ({
  initialValue,
  isSaving,
  onSubmit,
}: {
  initialValue?: Partial<SemesterInput>;
  isSaving: boolean;
  onSubmit: (value: SemesterInput) => Promise<void> | void;
}) => {
  const [form, setForm] = useState<SemesterInput>({
    ...defaultValue,
    ...initialValue,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canGenerateSlug =
    !initialValue?.slug || initialValue.slug === slugify(initialValue.name || "");

  const updateField = (field: keyof SemesterInput, value: string) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" && canGenerateSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = validateSemesterInput(form);
    setErrors(result.errors);
    if (!result.valid) return;
    await onSubmit(form);
  };

  return (
    <form
      className="grid gap-4 rounded-lg border border-amber-50/10 bg-zinc-900 p-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1">
          <span className={labelClass}>Code</span>
          <input
            className={inputClass}
            value={form.code}
            onChange={(event) => updateField("code", event.target.value)}
            placeholder="SPRING-2026"
          />
          {errors.code ? <span className="text-xs text-red-200">{errors.code}</span> : null}
        </label>

        <label className="grid gap-1">
          <span className={labelClass}>Name</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Spring 2026"
          />
          {errors.name ? <span className="text-xs text-red-200">{errors.name}</span> : null}
        </label>
      </div>

      <label className="grid gap-1">
        <span className={labelClass}>Slug</span>
        <input
          className={inputClass}
          value={form.slug}
          onChange={(event) => updateField("slug", event.target.value)}
          placeholder="spring-2026"
        />
        {errors.slug ? <span className="text-xs text-red-200">{errors.slug}</span> : null}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1">
          <span className={labelClass}>Start date</span>
          <input
            className={inputClass}
            type="date"
            value={form.startDate}
            onChange={(event) => updateField("startDate", event.target.value)}
          />
          {errors.startDate ? <span className="text-xs text-red-200">{errors.startDate}</span> : null}
        </label>

        <label className="grid gap-1">
          <span className={labelClass}>End date</span>
          <input
            className={inputClass}
            type="date"
            value={form.endDate}
            onChange={(event) => updateField("endDate", event.target.value)}
          />
          {errors.endDate ? <span className="text-xs text-red-200">{errors.endDate}</span> : null}
        </label>
      </div>

      <label className="grid gap-1">
        <span className={labelClass}>Description</span>
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaFloppyDisk />
          {isSaving ? "Saving..." : "Save semester"}
        </button>
      </div>
    </form>
  );
};

export default SemesterForm;
