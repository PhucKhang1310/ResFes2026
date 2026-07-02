import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminSemester, updateSemester } from "../../api/semesterApi";
import AdminLayout from "../../components/admin/AdminLayout";
import SemesterForm from "../../components/admin/semester/SemesterForm";
import LoadingPage from "../../components/loading/LoadingPage";
import type { Semester, SemesterInput } from "../../types/semester";

const toDateInput = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
};

const SemesterEditPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [semester, setSemester] = useState<Semester | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadSemester = async () => {
      try {
        setIsLoading(true);
        setError("");
        setSemester(await getAdminSemester(id, controller.signal));
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load semester.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadSemester();
    return () => controller.abort();
  }, [id]);

  const initialValue = useMemo(
    () =>
      semester
        ? {
            code: semester.code,
            name: semester.name,
            slug: semester.slug,
            status: semester.status,
            startDate: toDateInput(semester.startDate),
            endDate: toDateInput(semester.endDate),
            description: semester.description,
          }
        : undefined,
    [semester],
  );

  const handleSubmit = async (value: SemesterInput) => {
    try {
      setIsSaving(true);
      setError("");
      await updateSemester(id, value);
      navigate("/admin/semesters");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not update semester.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingPage label="Loading semester" />;
  }

  return (
    <AdminLayout description="Edit a CMS semester." title="Edit semester">
      <button
        type="button"
        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-3 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-amber-50/10"
        onClick={() => navigate("/admin/semesters")}
      >
        <FaArrowLeft />
        Back to semesters
      </button>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {initialValue ? (
        <SemesterForm
          initialValue={initialValue}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded-lg border border-amber-50/10 bg-black px-4 py-10 text-center text-sm text-amber-50/55">
          Semester not found.
        </div>
      )}
    </AdminLayout>
  );
};

export default SemesterEditPage;
