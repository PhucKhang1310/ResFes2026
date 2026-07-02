import { useEffect, useState } from "react";
import { FaImages, FaRotateRight, FaUpload } from "react-icons/fa6";
import { deleteMediaAsset, getMediaAssets } from "../../api/mediaApi";
import AdminLayout from "../../components/admin/AdminLayout";
import ForbiddenMessage from "../../components/auth/ForbiddenMessage";
import PermissionGate from "../../components/auth/PermissionGate";
import MediaCard from "../../components/media/MediaCard";
import MediaDetailsPanel from "../../components/media/MediaDetailsPanel";
import MediaUploadModal from "../../components/media/MediaUploadModal";
import type { MediaAsset } from "../../types/media";

const MediaLibraryPage = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssets = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      setAssets(await getMediaAssets({}, signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load media assets.",
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadAssets(controller.signal);
    return () => controller.abort();
  }, []);

  const handleCopy = async (asset: MediaAsset) => {
    await navigator.clipboard.writeText(asset.url);
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete ${asset.filename}?`)) return;

    try {
      setError("");
      await deleteMediaAsset(asset.id);
      setAssets((current) => current.filter((item) => item.id !== asset.id));
      if (selectedAsset?.id === asset.id) setSelectedAsset(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete asset.");
    }
  };

  return (
    <AdminLayout description="Browse uploaded CMS assets." title="Media library">
      <PermissionGate permission="media.manage" fallback={<ForbiddenMessage />}>
        <div className="mb-6 flex flex-col gap-4 border-b border-amber-50/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
              CMS media
            </p>
            <h1 className="mt-1 text-3xl font-bold text-amber-50">
              {assets.length} assets
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-50/55">
              Media APIs are scaffolded around Cloudinary-backed uploads for
              future CMS editors.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
            onClick={() => void loadAssets()}
          >
            <FaRotateRight />
            Refresh
          </button>
          <button
            type="button"
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b]"
            onClick={() => setIsUploadOpen(true)}
          >
            <FaUpload />
            Upload
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <p className="rounded-lg border border-amber-50/10 bg-black px-4 py-10 text-center text-sm text-amber-50/55">
            Loading media assets...
          </p>
        ) : assets.length === 0 ? (
          <p className="rounded-lg border border-amber-50/10 bg-black px-4 py-10 text-center text-sm text-amber-50/55">
            <span className="inline-flex items-center gap-2">
              <FaImages />
              No media assets found.
            </span>
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <MediaCard
                key={asset.id}
                asset={asset}
                onCopy={(item) => void handleCopy(item)}
                onDelete={(item) => void handleDelete(item)}
                onSelect={setSelectedAsset}
              />
            ))}
          </div>
        )}

        <MediaUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploaded={(asset) => setAssets((current) => [asset, ...current])}
        />
        <MediaDetailsPanel
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSaved={(asset) => {
            setSelectedAsset(asset);
            setAssets((current) =>
              current.map((item) => (item.id === asset.id ? asset : item)),
            );
          }}
        />
      </PermissionGate>
    </AdminLayout>
  );
};

export default MediaLibraryPage;
