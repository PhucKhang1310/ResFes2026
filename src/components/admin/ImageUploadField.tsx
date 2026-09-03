import { useState } from "react";
import { FaImage, FaPlus, FaTrash, FaUpload } from "react-icons/fa6";
import type { PageImageItem } from "../../data/contentData";
import type { MediaAsset } from "../../types/media";
import MediaUploadModal from "../media/MediaUploadModal";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const nextImageId = (items: PageImageItem[]) =>
  items.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;

const imageAlt = (asset: MediaAsset) => asset.altText?.trim() || asset.filename;

export const SingleImageUploadField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {value ? (
        <img
          src={value}
          alt=""
          className="h-32 w-full rounded border border-amber-50/10 bg-black object-cover"
        />
      ) : (
        <div className="grid h-32 place-items-center rounded border border-dashed border-amber-50/15 bg-black/40 text-amber-50/35">
          <FaImage className="text-2xl" aria-hidden="true" />
        </div>
      )}
      {isEditing ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded bg-[#ff6a1f] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b]"
            onClick={() => setIsUploadOpen(true)}
          >
            <FaUpload aria-hidden="true" />
            {value ? "Replace image" : "Upload image"}
          </button>
          {value ? (
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
              onClick={() => onChange("")}
            >
              <FaTrash aria-hidden="true" />
              Remove
            </button>
          ) : null}
        </div>
      ) : null}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={(asset) => onChange(asset.url)}
      />
    </div>
  );
};

export const ImageListUploadField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: PageImageItem[]) => void;
  value: PageImageItem[];
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {value.length > 0 ? (
        <div className="grid gap-2">
          {value.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-3 rounded border border-amber-50/10 bg-black/35 p-2"
            >
              <img
                src={item.url}
                alt=""
                className="h-14 w-[72px] rounded border border-amber-50/10 object-cover"
              />
              {isEditing ? (
                <label className="grid min-w-0 gap-1">
                  <span className="sr-only">Alt text</span>
                  <input
                    className={inputClass}
                    aria-label={`Alt text for ${item.alt || "image"}`}
                    placeholder="Describe this image"
                    value={item.alt}
                    onChange={(event) =>
                      onChange(
                        value.map((image) =>
                          image.id === item.id
                            ? { ...image, alt: event.target.value }
                            : image,
                        ),
                      )
                    }
                  />
                </label>
              ) : (
                <span className="min-w-0 break-words text-sm text-amber-50/80">
                  {item.alt || "No alt text"}
                </span>
              )}
              {isEditing ? (
                <button
                  type="button"
                  aria-label={`Remove ${item.alt || "image"}`}
                  title="Remove image"
                  className="inline-grid size-9 cursor-pointer place-items-center rounded border border-red-400/30 text-red-300 transition hover:bg-red-500/10"
                  onClick={() => onChange(value.filter((image) => image.id !== item.id))}
                >
                  <FaTrash aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-sm text-amber-50/45">No images uploaded.</span>
      )}
      {isEditing ? (
        <button
          type="button"
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded border border-[#ff6a1f]/60 px-3 py-2 text-sm font-semibold text-[#ff8a4c] transition hover:bg-[#ff6a1f]/10"
          onClick={() => setIsUploadOpen(true)}
        >
          <FaPlus aria-hidden="true" />
          Upload image
        </button>
      ) : null}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={(asset) =>
          onChange([
            ...value,
            {
              id: nextImageId(value),
              url: asset.url,
              alt: imageAlt(asset),
            },
          ])
        }
      />
    </div>
  );
};
