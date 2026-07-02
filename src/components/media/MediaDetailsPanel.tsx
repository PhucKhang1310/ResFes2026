import { useState } from "react";
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { updateMediaAsset } from "../../api/mediaApi";
import type { MediaAsset } from "../../types/media";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const MediaDetailsPanel = ({
  asset,
  onClose,
  onSaved,
}: {
  asset: MediaAsset | null;
  onClose: () => void;
  onSaved: (asset: MediaAsset) => void;
}) => {
  const [altText, setAltText] = useState(asset?.altText ?? "");
  const [caption, setCaption] = useState(asset?.caption ?? "");
  const [tags, setTags] = useState(asset?.tags.join(", ") ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!asset) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      const saved = await updateMediaAsset(asset.id, {
        altText,
        caption,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      onSaved(saved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save media.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-full max-w-md overflow-y-auto border-l border-amber-50/10 bg-zinc-950 p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-amber-50">Media details</h2>
        <button
          type="button"
          className="btn btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:bg-amber-50/10"
          onClick={onClose}
        >
          <FaXmark />
        </button>
      </div>

      <img src={asset.url} alt={asset.altText || asset.filename} className="mb-4 h-48 w-full rounded-lg object-cover" />
      <p className="mb-4 break-all text-xs text-amber-50/45">{asset.url}</p>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
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
          <input className={inputClass} value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
      </div>

      <button
        type="button"
        disabled={isSaving}
        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleSave}
      >
        <FaFloppyDisk />
        {isSaving ? "Saving..." : "Save changes"}
      </button>
    </aside>
  );
};

export default MediaDetailsPanel;
