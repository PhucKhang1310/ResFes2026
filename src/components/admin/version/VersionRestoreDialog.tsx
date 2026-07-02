import { FaRotateLeft, FaXmark } from "react-icons/fa6";
import type { ContentVersionSummary } from "../../../api/pageContentApi";

const VersionRestoreDialog = ({
  isRestoring,
  onClose,
  onConfirm,
  version,
}: {
  isRestoring: boolean;
  onClose: () => void;
  onConfirm: () => void;
  version: ContentVersionSummary | null;
}) => {
  if (!version) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-lg border border-amber-50/10 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-50">Restore as draft</h2>
          <button
            type="button"
            className="btn btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:bg-amber-50/10"
            onClick={onClose}
          >
            <FaXmark />
          </button>
        </div>
        <p className="text-sm leading-6 text-amber-50/65">
          Restore <span className="font-semibold text-amber-50">{version.label}</span>{" "}
          as a draft version. This will not publish live content.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="btn border-amber-50/15 bg-transparent text-amber-50 hover:bg-amber-50/10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isRestoring}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:opacity-60"
            onClick={onConfirm}
          >
            <FaRotateLeft />
            {isRestoring ? "Restoring..." : "Restore draft"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionRestoreDialog;
