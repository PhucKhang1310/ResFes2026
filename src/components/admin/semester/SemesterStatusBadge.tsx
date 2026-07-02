import type { SemesterStatus } from "../../../types/cms";

const statusClass: Record<SemesterStatus, string> = {
  active: "border-emerald-400/40 bg-emerald-950/50 text-emerald-100",
  archived: "border-zinc-500/40 bg-zinc-900 text-zinc-200",
  draft: "border-amber-400/40 bg-amber-950/50 text-amber-100",
};

const SemesterStatusBadge = ({ status }: { status: SemesterStatus }) => (
  <span
    className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass[status]}`}
  >
    {status}
  </span>
);

export default SemesterStatusBadge;
