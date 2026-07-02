import { useState, type FormEvent } from "react";
import { FaUpload, FaXmark } from "react-icons/fa6";
import { uploadMediaAsset } from "../../api/mediaApi";
import type { MediaAsset } from "../../types/media";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const MediaUploadModal = ({
  isOpen,
  onClose,
  onUploaded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (asset: MediaAsset) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      const asset = await uploadMediaAsset(file, {
        altText,
        caption,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      onUploaded(asset);
      onClose();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Could not upload media.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form
        className="w-full max-w-lg rounded-lg border border-amber-50/10 bg-zinc-950 p-5 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-50">Upload media</h2>
          <button
            type="button"
            className="btn btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:bg-amber-50/10"
            onClick={onClose}
          >
            <FaXmark />
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className={labelClass}>File</span>
            <input
              className={inputClass}
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="grid gap-1">
            <span className={labelClass}>Alt text</span>
            <input className={inputClass} value={altText} onChange={(event) => setAltText(event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className={labelClass}>Caption</span>
            <input className={inputClass} value={caption} onChange={(event) => setCaption(event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className={labelClass}>Tags</span>
            <input
              className={inputClass}
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="hero, news, sponsor"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaUpload />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaUploadModal;
