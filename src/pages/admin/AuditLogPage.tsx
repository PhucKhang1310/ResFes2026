import { useCallback, useEffect, useState } from "react";
import { FaRotateRight } from "react-icons/fa6";
import { getAuditLogs } from "../../api/auditLogApi";
import AdminLayout from "../../components/admin/AdminLayout";
import AuditLogDetailsDrawer from "../../components/admin/audit/AuditLogDetailsDrawer";
import AuditLogFilters, {
  type AuditLogFilterValue,
} from "../../components/admin/audit/AuditLogFilters";
import AuditLogTable from "../../components/admin/audit/AuditLogTable";
import ForbiddenMessage from "../../components/auth/ForbiddenMessage";
import PermissionGate from "../../components/auth/PermissionGate";
import type { AuditLog } from "../../types/auditLog";

const emptyFilters: AuditLogFilterValue = {
  actor: "",
  action: "",
  targetType: "",
  dateFrom: "",
  dateTo: "",
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filters, setFilters] = useState(emptyFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      setLogs(await getAuditLogs(filters, signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load audit logs.",
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    void loadLogs(controller.signal);
    return () => controller.abort();
  }, [loadLogs]);

  return (
    <AdminLayout description="Review CMS activity." title="Audit logs">
      <PermissionGate permission="audit.read" fallback={<ForbiddenMessage />}>
        <div className="mb-6 flex flex-col gap-4 border-b border-amber-50/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
              CMS audit trail
            </p>
            <h1 className="mt-1 text-3xl font-bold text-amber-50">
              {logs.length} entries
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-50/55">
              Audit log APIs are scaffolded for CMS mutations and read-only
              admin review.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
            onClick={() => void loadLogs()}
          >
            <FaRotateRight />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <AuditLogFilters value={filters} onChange={setFilters} />
        <AuditLogTable
          isLoading={isLoading}
          logs={logs}
          onSelect={setSelectedLog}
        />
        <AuditLogDetailsDrawer
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      </PermissionGate>
    </AdminLayout>
  );
};

export default AuditLogPage;
