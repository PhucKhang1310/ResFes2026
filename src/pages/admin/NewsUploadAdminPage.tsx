import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { submitNews, type NewsSubmissionPayload } from "../../api/newsApi";
import NewsEditorForm from "../../components/admin/news/NewsEditorForm";
import { useUser } from "../../hook/useUser";

const NewsUploadAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <p className="py-12 text-center text-sm text-slate-400">
          Checking login status...
        </p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleSubmit = async (payload: NewsSubmissionPayload) => {
    try {
      setIsSubmitting(true);
      setStatus("");

      await submitNews(payload);

      setStatus("News saved successfully.");
      navigate("/admin/news");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "News submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 text-sm cursor-pointer text-slate-300 transition hover:text-white"
          onClick={() => navigate("/admin/news")}
        >
          <FaArrowLeft />
          Back to news admin
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create News</h1>
          <p className="mt-2 text-sm text-slate-400">
            Submit a news article to MongoDB `newsDb.newsCollection`.
          </p>
        </div>

        <NewsEditorForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          statusMessage={status}
          submitLabel="Submit news"
        />
      </section>
    </main>
  );
};

export default NewsUploadAdminPage;
