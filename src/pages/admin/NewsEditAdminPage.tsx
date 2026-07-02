import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  fetchNewsById,
  updateNews,
  type NewsRecord,
  type NewsSubmissionPayload,
} from "../../api/newsApi";
import NewsEditorForm, {
  type NewsEditorValue,
} from "../../components/admin/news/NewsEditorForm";
import LoadingPage from "../../components/loading/LoadingPage";
import { useUser } from "../../hook/useUser";

const urlsToText = (urls: string[]) => urls.join("\n");

const toDateInputValue = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
};

const NewsEditAdminPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsRecord | null>(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetchNewsById(id, controller.signal)
      .then((record) => {
        setNews(record);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setStatus(error instanceof Error ? error.message : "Could not load news.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <LoadingPage label="Loading news editor" />;
  }

  const initialValue = news
    ? ({
        title: news.title,
        slug: news.slug,
        description: news.description,
        summary: news.summary || news.description,
        thumbNailImage: news.thumbNailImage,
        images: news.images,
        imagesText: urlsToText(news.images),
        date: toDateInputValue(news.date),
        content: news.content,
        body: news.body || news.content,
        author: news.author,
        coverImageId: news.coverImageId,
        coverImageUrl: news.coverImageUrl,
        status: news.status || "published",
        category: news.category,
        tags: news.tags,
        tagsText: news.tags?.join(", ") || "",
        isPinned: news.isPinned,
        isFeatured: news.isFeatured,
        seoTitle: news.seoTitle,
        seoDescription: news.seoDescription,
        publishedAt: news.publishedAt,
        scheduledFor: news.scheduledFor,
        semesterId: news.semesterId,
      } satisfies Partial<NewsEditorValue>)
    : null;

  const handleSubmit = async (payload: NewsSubmissionPayload) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      setStatus("");

      await updateNews(id, payload);

      setStatus("News updated successfully.");
      navigate("/admin/news");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "News update failed.");
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
          <h1 className="text-3xl font-bold text-white">Edit News</h1>
          <p className="mt-2 text-sm text-slate-400">
            Update the article details shown on the public news page.
          </p>
        </div>

        {!initialValue && status ? (
          <div className="rounded-md border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {status}
          </div>
        ) : (
          <NewsEditorForm
            initialValue={initialValue ?? undefined}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            statusMessage={status}
            submitLabel="Save changes"
          />
        )}
      </section>
    </main>
  );
};

export default NewsEditAdminPage;
