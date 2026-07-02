import type { VersionDiffItem } from "../../../api/contentVersionApi";

const VersionDiffViewer = ({ diff }: { diff: VersionDiffItem[] }) => (
  <div className="grid gap-3">
    {diff.length === 0 ? (
      <p className="text-sm text-amber-50/55">No top-level changes found.</p>
    ) : (
      diff.map((item) => (
        <div
          key={item.field}
          className="rounded-lg border border-amber-50/10 bg-black p-3"
        >
          <h4 className="mb-2 text-sm font-semibold text-[#ff6a1f]">
            {item.field}
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <pre className="max-h-56 overflow-auto rounded border border-red-200/20 bg-red-950/20 p-2 text-xs text-red-50/80">
              {JSON.stringify(item.before, null, 2)}
            </pre>
            <pre className="max-h-56 overflow-auto rounded border border-emerald-200/20 bg-emerald-950/20 p-2 text-xs text-emerald-50/80">
              {JSON.stringify(item.after, null, 2)}
            </pre>
          </div>
        </div>
      ))
    )}
  </div>
);

export default VersionDiffViewer;
