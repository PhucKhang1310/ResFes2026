import { FaXmark } from "react-icons/fa6";
import type { AuditLog } from "../../../types/auditLog";

const JsonBlock = ({ label, value }: { label: string; value: unknown }) => (
  <section className="grid gap-2">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-50/55">
      {label}
    </h3>
    <pre className="max-h-64 overflow-auto rounded-lg border border-amber-50/10 bg-black p-3 text-xs text-amber-50/70">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  </section>
);

const AuditLogDetailsDrawer = ({
  log,
  onClose,
}: {
  log: AuditLog | null;
  onClose: () => void;
}) => {
  if (!log) return null;

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-full max-w-xl overflow-y-auto border-l border-amber-50/10 bg-zinc-950 p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-amber-50">{log.action}</h2>
          <p className="mt-1 text-xs text-amber-50/45">
            {new Date(log.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:bg-amber-50/10"
          onClick={onClose}
        >
          <FaXmark />
        </button>
      </div>

      <div className="grid gap-4">
        <JsonBlock label="Metadata" value={log.metadata} />
        <JsonBlock label="Before" value={log.before} />
        <JsonBlock label="After" value={log.after} />
      </div>
    </aside>
  );
};

export default AuditLogDetailsDrawer;
