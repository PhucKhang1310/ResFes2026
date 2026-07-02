import { FaFileLines } from "react-icons/fa6";
import type { AuditLog } from "../../../types/auditLog";

const AuditLogTable = ({
  isLoading,
  logs,
  onSelect,
}: {
  isLoading: boolean;
  logs: AuditLog[];
  onSelect: (log: AuditLog) => void;
}) => (
  <div className="overflow-hidden rounded-lg border border-amber-50/10 bg-black">
    <table className="table">
      <thead className="bg-zinc-950 text-amber-50/45">
        <tr className="border-amber-50/10">
          <th>Timestamp</th>
          <th>Actor</th>
          <th>Action</th>
          <th>Target</th>
          <th className="text-right">Details</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr className="border-amber-50/10">
            <td colSpan={5} className="py-10 text-center text-sm text-amber-50/55">
              Loading audit logs...
            </td>
          </tr>
        ) : logs.length === 0 ? (
          <tr className="border-amber-50/10">
            <td colSpan={5} className="py-10 text-center text-sm text-amber-50/55">
              <span className="inline-flex items-center gap-2">
                <FaFileLines />
                No audit logs found.
              </span>
            </td>
          </tr>
        ) : (
          logs.map((log) => (
            <tr key={log.id} className="border-amber-50/10">
              <td className="text-amber-50/60">
                {new Date(log.createdAt).toLocaleString("vi-VN")}
              </td>
              <td>{log.actorEmail || log.actorId || "System"}</td>
              <td className="font-semibold text-amber-50">{log.action}</td>
              <td className="text-amber-50/60">
                {log.targetType}
                {log.targetId ? `:${log.targetId}` : ""}
              </td>
              <td className="text-right">
                <button
                  type="button"
                  className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                  onClick={() => onSelect(log)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AuditLogTable;
