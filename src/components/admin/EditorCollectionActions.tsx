import { FaPlus, FaTrash } from "react-icons/fa6";

export const AddCollectionItemButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    className="inline-flex cursor-pointer items-center gap-2 rounded border border-[#ff6a1f]/60 px-3 py-2 text-sm font-semibold text-[#ff8a4c] transition hover:bg-[#ff6a1f]/10"
    onClick={onClick}
  >
    <FaPlus aria-hidden="true" />
    {label}
  </button>
);

export const RemoveCollectionItemButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className="inline-grid size-9 shrink-0 cursor-pointer place-items-center rounded border border-red-400/30 text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
    onClick={onClick}
  >
    <FaTrash aria-hidden="true" />
  </button>
);
