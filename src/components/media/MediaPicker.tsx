import { useEffect, useState } from "react";
import { getMediaAssets } from "../../api/mediaApi";
import type { MediaAsset } from "../../types/media";
import MediaCard from "./MediaCard";

const MediaPicker = ({
  onSelect,
}: {
  onSelect: (asset: MediaAsset) => void;
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getMediaAssets({}, controller.signal)
      .then(setAssets)
      .catch(() => setAssets([]));
    return () => controller.abort();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <MediaCard
          key={asset.id}
          asset={asset}
          onCopy={() => undefined}
          onDelete={() => undefined}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default MediaPicker;
