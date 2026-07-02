import { FaCopy, FaTrash } from "react-icons/fa6";
import type { MediaAsset } from "../../types/media";

const MediaCard = ({
  asset,
  onCopy,
  onDelete,
  onSelect,
}: {
  asset: MediaAsset;
  onCopy: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
  onSelect: (asset: MediaAsset) => void;
}) => (
  <article className="overflow-hidden rounded-lg border border-amber-50/10 bg-black">
    <button
      type="button"
      className="block w-full cursor-pointer text-left"
      onClick={() => onSelect(asset)}
    >
      <img
        src={asset.url}
        alt={asset.altText || asset.filename}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h2 className="line-clamp-1 text-sm font-semibold text-amber-50">
          {asset.filename}
        </h2>
        <p className="mt-1 text-xs text-amber-50/50">{asset.mimeType}</p>
      </div>
    </button>
    <div className="flex gap-2 border-t border-amber-50/10 p-3">
      <button
        type="button"
        className="btn btn-xs flex-1 border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
        onClick={() => onCopy(asset)}
      >
        <FaCopy />
        Copy URL
      </button>
      <button
        type="button"
        className="btn btn-xs border-red-200/20 bg-transparent text-red-100 hover:border-red-300/40 hover:bg-red-950/50"
        onClick={() => onDelete(asset)}
      >
        <FaTrash />
      </button>
    </div>
  </article>
);

export default MediaCard;
