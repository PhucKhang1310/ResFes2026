import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { createSemester } from "../../api/semesterApi";
import AdminLayout from "../../components/admin/AdminLayout";
import SemesterForm from "../../components/admin/semester/SemesterForm";
import type { SemesterInput } from "../../types/semester";

const SemesterCreatePage = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (value: SemesterInput) => {
    try {
      setIsSaving(true);
      setError("");
      await createSemester(value);
      navigate("/admin/semesters");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create semester.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout description="Create a CMS semester." title="Create semester">
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

      <SemesterForm isSaving={isSaving} onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default SemesterCreatePage;
