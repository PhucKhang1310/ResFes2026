import { useState, type FormEvent } from "react";
import { FaFloppyDisk } from "react-icons/fa6";
import type { NewsSubmissionPayload } from "../../../api/newsApi";
import { validateNewsInput } from "../../../validation/newsValidation";

export type NewsEditorValue = NewsSubmissionPayload & {
  imagesText: string;
  tagsText: string;
};

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";
const labelClass = "text-xs font-semibold uppercase text-slate-400";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const textToList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const defaultValue: NewsEditorValue = {
  title: "",
  slug: "",
  description: "",
  summary: "",
  thumbNailImage: "",
  thumbNailImageFile: null,
  images: [],
  imagesText: "",
  imageFiles: [],
  date: new Date().toISOString().slice(0, 10),
  content: "",
  body: "",
  author: "",
  coverImageId: "",
  coverImageUrl: "",
  status: "draft",
  category: "",
  tags: [],
  tagsText: "",
  isPinned: false,
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  publishedAt: "",
  scheduledFor: "",
  semesterId: "",
};

const NewsEditorForm = ({
  initialValue,
  isSubmitting,
  onSubmit,
  submitLabel,
  statusMessage,
}: {
  initialValue?: Partial<NewsEditorValue>;
  isSubmitting: boolean;
  onSubmit: (payload: NewsSubmissionPayload) => Promise<void> | void;
  submitLabel: string;
  statusMessage?: string;
}) => {
  const [form, setForm] = useState<NewsEditorValue>({
    ...defaultValue,
    ...initialValue,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <Field extends keyof NewsEditorValue>(
    field: Field,
    value: NewsEditorValue[Field],
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && (!current.slug || current.slug === slugify(current.title))) {
        next.slug = slugify(String(value));
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: NewsSubmissionPayload = {
      ...form,
      images: textToList(form.imagesText),
      tags: textToList(form.tagsText),
      body: form.body || form.content,
      coverImageUrl: form.coverImageUrl || form.thumbNailImage,
    };
    const validation = validateNewsInput({
      title: payload.title,
      slug: payload.slug,
      body: payload.body || payload.content,
      status: payload.status,
      scheduledFor: payload.scheduledFor,
    });
    setErrors(validation.errors);
    if (!validation.valid) return;
    await onSubmit(payload);
  };

  return (
    <form
      className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Title</span>
          <input className={inputClass} required value={form.title} onChange={(event) => update("title", event.target.value)} />
          {errors.title ? <span className="text-xs text-red-200">{errors.title}</span> : null}
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Slug</span>
          <input className={inputClass} required value={form.slug} onChange={(event) => update("slug", event.target.value)} />
          {errors.slug ? <span className="text-xs text-red-200">{errors.slug}</span> : null}
        </label>
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Summary</span>
        <textarea className={`${inputClass} min-h-24 resize-y`} value={form.summary || form.description} onChange={(event) => {
          update("summary", event.target.value);
          update("description", event.target.value);
        }} />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2">
          <span className={labelClass}>Author</span>
          <input className={inputClass} required value={form.author} onChange={(event) => update("author", event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Date</span>
          <input type="date" className={inputClass} required value={form.date} onChange={(event) => update("date", event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Status</span>
          <select className={inputClass} value={form.status} onChange={(event) => update("status", event.target.value as NewsSubmissionPayload["status"])}>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2">
          <span className={labelClass}>Category</span>
          <input className={inputClass} value={form.category} onChange={(event) => update("category", event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Scheduled for</span>
          <input type="datetime-local" className={inputClass} value={form.scheduledFor} onChange={(event) => update("scheduledFor", event.target.value)} />
          {errors.scheduledFor ? <span className="text-xs text-red-200">{errors.scheduledFor}</span> : null}
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Semester ID</span>
          <input className={inputClass} value={form.semesterId} onChange={(event) => update("semesterId", event.target.value)} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={form.isPinned} onChange={(event) => update("isPinned", event.target.checked)} />
          Pinned
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} />
          Featured
        </label>
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Thumbnail image URL</span>
        <input className={inputClass} placeholder="https://..." value={form.thumbNailImage} onChange={(event) => update("thumbNailImage", event.target.value)} />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Thumbnail image file</span>
        <input type="file" accept="image/*" className={inputClass} onChange={(event) => update("thumbNailImageFile", event.target.files?.[0] ?? null)} />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Gallery image URLs</span>
        <textarea className={`${inputClass} min-h-24 resize-y font-mono text-xs`} placeholder="One image URL per line" value={form.imagesText} onChange={(event) => update("imagesText", event.target.value)} />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Gallery image files</span>
        <input type="file" accept="image/*" multiple className={inputClass} onChange={(event) => update("imageFiles", Array.from(event.target.files ?? []))} />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Body</span>
        <textarea className={`${inputClass} min-h-56 resize-y`} value={form.body || form.content} onChange={(event) => {
          update("body", event.target.value);
          update("content", event.target.value);
        }} />
        {errors.body ? <span className="text-xs text-red-200">{errors.body}</span> : null}
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Tags</span>
          <input className={inputClass} placeholder="keynote, award" value={form.tagsText} onChange={(event) => update("tagsText", event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Cover image ID</span>
          <input className={inputClass} value={form.coverImageId} onChange={(event) => update("coverImageId", event.target.value)} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>SEO title</span>
          <input className={inputClass} value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>SEO description</span>
          <input className={inputClass} value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
        {statusMessage ? <p className="text-sm text-slate-300">{statusMessage}</p> : <span />}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaFloppyDisk />
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default NewsEditorForm;
