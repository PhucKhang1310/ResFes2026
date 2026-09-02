import { useRef, useState, type FormEvent } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaFloppyDisk,
  FaImage,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";
import type { NewsSubmissionPayload } from "../../../api/newsApi";
import {
  createNewsBlockId,
  parseNewsArticle,
  serializeNewsArticle,
  type NewsArticleBlock,
  type NewsArticleImageBlock,
  type StoredNewsArticleBlock,
} from "../../../utils/newsArticleContent";
import { validateNewsInput } from "../../../validation/newsValidation";

type EditorImageBlock = NewsArticleImageBlock & {
  file?: File;
  previewUrl?: string;
};

export type NewsEditorArticleBlock =
  | Exclude<NewsArticleBlock, NewsArticleImageBlock>
  | EditorImageBlock;

export type NewsEditorValue = NewsSubmissionPayload & {
  imagesText: string;
  tagsText: string;
  articleBlocks: NewsEditorArticleBlock[];
};

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";
const labelClass = "text-xs font-semibold uppercase text-slate-400";
const secondaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

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

const makeTextBlock = (
  type: "paragraph" | "heading" | "quote" = "paragraph",
): NewsEditorArticleBlock => ({ id: createNewsBlockId(), type, text: "" });

const defaultValue: Omit<NewsEditorValue, "articleBlocks"> = {
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

const createInitialValue = (
  initialValue?: Partial<NewsEditorValue>,
): NewsEditorValue => {
  const merged = { ...defaultValue, ...initialValue };
  const parsed = parseNewsArticle(
    initialValue?.body || initialValue?.content || "",
    initialValue?.images || [],
  );

  return {
    ...merged,
    articleBlocks:
      initialValue?.articleBlocks?.length
        ? initialValue.articleBlocks
        : parsed.blocks.length
          ? parsed.blocks
          : [makeTextBlock()],
  };
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
  const [form, setForm] = useState<NewsEditorValue>(() =>
    createInitialValue(initialValue),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  const setBlocks = (
    value:
      | NewsEditorArticleBlock[]
      | ((current: NewsEditorArticleBlock[]) => NewsEditorArticleBlock[]),
  ) => {
    setForm((current) => ({
      ...current,
      articleBlocks:
        typeof value === "function" ? value(current.articleBlocks) : value,
    }));
    setErrors((current) => ({ ...current, body: "" }));
  };

  const insertTextBlock = (type: "paragraph" | "heading" | "quote") => {
    setBlocks((current) => [...current, makeTextBlock(type)]);
  };

  const insertUrlImage = () => {
    setBlocks((current) => [
      ...current,
      {
        id: createNewsBlockId(),
        type: "image",
        url: "",
        alt: "",
        caption: "",
      },
    ]);
  };

  const insertImageFiles = (files: File[]) => {
    if (!files.length) return;

    const blocks = files.map<EditorImageBlock>((file) => ({
      id: createNewsBlockId(),
      type: "image",
      file,
      previewUrl: URL.createObjectURL(file),
      url: "",
      alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      caption: "",
    }));
    setBlocks((current) => [...current, ...blocks]);
  };

  const updateBlock = (id: string, patch: Partial<NewsEditorArticleBlock>) => {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id ? ({ ...block, ...patch } as NewsEditorArticleBlock) : block,
      ),
    );
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((current) => {
      const removed = current.find((block) => block.id === id);
      if (removed?.type === "image" && removed.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      const next = current.filter((block) => block.id !== id);
      return next.length ? next : [makeTextBlock()];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validBlocks = form.articleBlocks.filter((block) =>
      block.type === "image" ? Boolean(block.file || block.url.trim()) : Boolean(block.text.trim()),
    );
    const urlImages = validBlocks.filter(
      (block): block is EditorImageBlock =>
        block.type === "image" && !block.file && Boolean(block.url.trim()),
    );
    const fileImages = validBlocks.filter(
      (block): block is EditorImageBlock => block.type === "image" && Boolean(block.file),
    );
    const urlIndex = new Map(urlImages.map((block, index) => [block.id, index]));
    const fileIndex = new Map(fileImages.map((block, index) => [block.id, index]));

    const storedBlocks = validBlocks.map<StoredNewsArticleBlock>((block) => {
      if (block.type !== "image") {
        return { type: block.type, text: block.text.trim() };
      }

      const imageIndex = block.file
        ? urlImages.length + (fileIndex.get(block.id) ?? 0)
        : (urlIndex.get(block.id) ?? 0);
      return {
        type: "image",
        imageIndex,
        alt: block.alt.trim(),
        caption: block.caption.trim(),
      };
    });
    const articleContent = serializeNewsArticle(storedBlocks);
    const payload: NewsSubmissionPayload = {
      ...form,
      images: urlImages.map((block) => block.url.trim()),
      imageFiles: fileImages.flatMap((block) => (block.file ? [block.file] : [])),
      tags: textToList(form.tagsText),
      content: articleContent,
      body: articleContent,
    };
    const hasWrittenContent = validBlocks.some(
      (block) => block.type !== "image" && Boolean(block.text.trim()),
    );
    const validation = validateNewsInput({
      title: payload.title,
      slug: payload.slug,
      body: hasWrittenContent ? payload.body : "",
      status: payload.status,
      scheduledFor: payload.scheduledFor,
    });
    setErrors(validation.errors);
    if (!validation.valid) return;
    await onSubmit(payload);
  };

  return (
    <form
      className="grid gap-6 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/20 sm:p-7"
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
        <span className={labelClass}>Summary / standfirst</span>
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

      <section className="grid gap-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Article layout</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
              Add text and images in reading order. Use the arrows on a block to rearrange it. Multiple image selections are appended, so you can upload in several batches.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={secondaryButtonClass} onClick={() => insertTextBlock("paragraph")}><FaPlus /> Paragraph</button>
            <button type="button" className={secondaryButtonClass} onClick={() => insertTextBlock("heading")}><FaPlus /> Heading</button>
            <button type="button" className={secondaryButtonClass} onClick={() => insertTextBlock("quote")}><FaPlus /> Quote</button>
            <button type="button" className={secondaryButtonClass} onClick={insertUrlImage}><FaImage /> Image URL</button>
            <button type="button" className={secondaryButtonClass} onClick={() => galleryInputRef.current?.click()}><FaImage /> Upload images</button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                insertImageFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="grid gap-3">
          {form.articleBlocks.map((block, index) => (
            <article key={block.id} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded bg-slate-800 px-2 py-1 text-xs font-bold uppercase tracking-wide text-orange-300">
                  {index + 1}. {block.type}
                </span>
                <div className="flex gap-1">
                  <button type="button" aria-label="Move block up" title="Move up" className={secondaryButtonClass} disabled={index === 0} onClick={() => moveBlock(index, -1)}><FaArrowUp /></button>
                  <button type="button" aria-label="Move block down" title="Move down" className={secondaryButtonClass} disabled={index === form.articleBlocks.length - 1} onClick={() => moveBlock(index, 1)}><FaArrowDown /></button>
                  <button type="button" aria-label="Delete block" title="Delete block" className={`${secondaryButtonClass} hover:border-red-500 hover:text-red-200`} onClick={() => removeBlock(block.id)}><FaTrash /></button>
                </div>
              </div>

              {block.type === "image" ? (
                <div className="grid gap-4 md:grid-cols-[minmax(180px,260px)_1fr]">
                  <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-md border border-slate-700 bg-slate-950">
                    {block.previewUrl || block.url ? (
                      <img src={block.previewUrl || block.url} alt={block.alt || "Article image preview"} className="max-h-64 w-full object-contain" />
                    ) : (
                      <span className="px-4 text-center text-sm text-slate-500">Enter an image URL</span>
                    )}
                  </div>
                  <div className="grid content-start gap-3">
                    {block.file ? (
                      <p className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">Selected file: <span className="font-medium text-white">{block.file.name}</span></p>
                    ) : (
                      <label className="grid gap-2"><span className={labelClass}>Image URL</span><input type="url" className={inputClass} placeholder="https://..." value={block.url} onChange={(event) => updateBlock(block.id, { url: event.target.value })} /></label>
                    )}
                    <label className="grid gap-2"><span className={labelClass}>Alternative text</span><input className={inputClass} placeholder="Describe the image for readers using screen readers" value={block.alt} onChange={(event) => updateBlock(block.id, { alt: event.target.value })} /></label>
                    <label className="grid gap-2"><span className={labelClass}>Caption / credit</span><textarea className={`${inputClass} min-h-20 resize-y`} placeholder="Caption, photographer, or source" value={block.caption} onChange={(event) => updateBlock(block.id, { caption: event.target.value })} /></label>
                  </div>
                </div>
              ) : (
                <textarea
                  className={`${inputClass} resize-y ${block.type === "heading" ? "min-h-20 text-lg font-bold" : "min-h-32"}`}
                  placeholder={block.type === "heading" ? "Section heading" : block.type === "quote" ? "Quotation" : "Write this section of the article..."}
                  value={block.text}
                  onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                />
              )}
            </article>
          ))}
        </div>
        {errors.body ? <span className="text-sm text-red-200">{errors.body}</span> : null}
      </section>

      <section className="grid gap-5 rounded-xl border border-slate-800 p-4 sm:p-5">
        <div>
          <h2 className="text-base font-bold text-white">Cover image</h2>
          <p className="mt-1 text-sm text-slate-400">The cover is shown above the article. Inline images belong in the article layout.</p>
        </div>
        <label className="grid gap-2">
          <span className={labelClass}>Thumbnail image URL</span>
          <input className={inputClass} placeholder="https://..." value={form.thumbNailImage} onChange={(event) => update("thumbNailImage", event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Or upload a thumbnail</span>
          <input type="file" accept="image/*" className={inputClass} onChange={(event) => update("thumbNailImageFile", event.target.files?.[0] ?? null)} />
        </label>
      </section>

      <section className="grid gap-5 rounded-xl border border-slate-800 p-4 sm:p-5">
        <h2 className="text-base font-bold text-white">Publishing details</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <label className="grid gap-2"><span className={labelClass}>Category</span><input className={inputClass} value={form.category} onChange={(event) => update("category", event.target.value)} /></label>
          <label className="grid gap-2"><span className={labelClass}>Scheduled for</span><input type="datetime-local" className={inputClass} value={form.scheduledFor} onChange={(event) => update("scheduledFor", event.target.value)} />{errors.scheduledFor ? <span className="text-xs text-red-200">{errors.scheduledFor}</span> : null}</label>
          <label className="grid gap-2"><span className={labelClass}>Semester ID</span><input className={inputClass} value={form.semesterId} onChange={(event) => update("semesterId", event.target.value)} /></label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2"><span className={labelClass}>Tags</span><input className={inputClass} placeholder="keynote, award" value={form.tagsText} onChange={(event) => update("tagsText", event.target.value)} /></label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.isPinned} onChange={(event) => update("isPinned", event.target.checked)} />Pinned</label>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} />Featured</label>
        </div>
      </section>

      <section className="grid gap-5 rounded-xl border border-slate-800 p-4 sm:p-5">
        <h2 className="text-base font-bold text-white">Search appearance</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2"><span className={labelClass}>SEO title</span><input className={inputClass} value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} /></label>
          <label className="grid gap-2"><span className={labelClass}>SEO description</span><input className={inputClass} value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} /></label>
        </div>
      </section>

      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        {statusMessage ? <p className="text-sm text-slate-300">{statusMessage}</p> : <span />}
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">
          <FaFloppyDisk />
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default NewsEditorForm;
