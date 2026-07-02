import { useEffect, useState } from "react";
import { FaBoxArchive, FaCopy, FaPen, FaPlus, FaRotateRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  activateSemester,
  archiveSemester,
  duplicateSemester,
  getAdminSemesters,
} from "../../api/semesterApi";
import AdminLayout from "../../components/admin/AdminLayout";
import ForbiddenMessage from "../../components/auth/ForbiddenMessage";
import PermissionGate from "../../components/auth/PermissionGate";
import SemesterStatusBadge from "../../components/admin/semester/SemesterStatusBadge";
import type { Semester } from "../../types/semester";

const SemesterAdminPage = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadSemesters = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      setSemesters(await getAdminSemesters(signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load semesters.",
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadSemesters(controller.signal);
    return () => controller.abort();
  }, []);

  const runAction = async (
    id: string,
    action: (id: string) => Promise<unknown>,
    confirmMessage?: string,
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    try {
      setBusyId(id);
      setError("");
      await action(id);
      await loadSemesters();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Could not update semester.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <AdminLayout
      description="Manage SRC2026 semester cycles."
      title="Semester management"
    >
      <PermissionGate
        permission="semesters.manage"
        fallback={<ForbiddenMessage />}
      >
        <div className="mb-6 flex flex-col gap-4 border-b border-amber-50/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
              CMS semesters
            </p>
            <h1 className="mt-1 text-3xl font-bold text-amber-50">
              {semesters.length} semesters
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-50/55">
              Semester APIs are scaffolded for the CMS migration. Create and edit
              screens can now be built against this contract.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
            onClick={() => void loadSemesters()}
          >
            <FaRotateRight />
            Refresh
          </button>
          <button
            type="button"
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b]"
            onClick={() => navigate("/admin/semesters/new")}
          >
            <FaPlus />
            New semester
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-amber-50/10 bg-black">
          <table className="table">
            <thead className="bg-zinc-950 text-amber-50/45">
              <tr className="border-amber-50/10">
                <th>Code</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Dates</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-amber-50/10">
                  <td colSpan={6} className="py-10 text-center text-sm text-amber-50/55">
                    Loading semesters...
                  </td>
                </tr>
              ) : semesters.length === 0 ? (
                <tr className="border-amber-50/10">
                  <td colSpan={6} className="py-10 text-center text-sm text-amber-50/55">
                    <span className="inline-flex items-center gap-2">
                      <FaBoxArchive />
                      No semesters found.
                    </span>
                  </td>
                </tr>
              ) : (
                semesters.map((semester) => (
                  <tr key={semester.id} className="border-amber-50/10">
                    <td className="font-semibold text-amber-50">{semester.code}</td>
                    <td>{semester.name}</td>
                    <td className="text-amber-50/60">{semester.slug}</td>
                    <td>
                      <SemesterStatusBadge status={semester.status} />
                    </td>
                    <td className="text-amber-50/60">
                      {semester.startDate} - {semester.endDate}
                    </td>
                    <td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                          onClick={() => navigate(`/admin/semesters/${semester.id}/edit`)}
                        >
                          <FaPen />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={busyId === semester.id || semester.status === "active"}
                          className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10 disabled:opacity-40"
                          onClick={() =>
                            void runAction(
                              semester.id,
                              activateSemester,
                              "Activating this semester will archive the currently active semester. Continue?",
                            )
                          }
                        >
                          Activate
                        </button>
                        <button
                          type="button"
                          disabled={busyId === semester.id || semester.status === "archived"}
                          className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10 disabled:opacity-40"
                          onClick={() => void runAction(semester.id, archiveSemester)}
                        >
                          Archive
                        </button>
                        <button
                          type="button"
                          disabled={busyId === semester.id}
                          className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10 disabled:opacity-40"
                          onClick={() => void runAction(semester.id, duplicateSemester)}
                        >
                          <FaCopy />
                          Duplicate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PermissionGate>
    </AdminLayout>
  );
};

export default SemesterAdminPage;
