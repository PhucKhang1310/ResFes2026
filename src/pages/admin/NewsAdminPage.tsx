import { useEffect, useMemo, useState } from "react";
import { FaPen, FaPlus, FaRotateRight, FaTrash } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchNews, type NewsRecord } from "../../api/newsApi";
import { deleteAdminNews } from "../../api/adminContentApi";
import { useUser } from "../../hook/useUser";
import LoadingPage from "../../components/loading/LoadingPage";
import Pagination from "../../components/pagination/Pagination";
import AdminSidebar from "./AdminSidebar";
import Alert from "../../components/utils/Alert";

const NewsAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const pageSize = 10;
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredNews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const semester = semesterFilter.trim().toLowerCase();

    return news.filter((item) => {
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesSemester = semester
        ? (item.semesterId || "").toLowerCase().includes(semester)
        : true;
      const searchable = [
        item.title,
        item.slug,
        item.description,
        item.summary,
        item.author,
        item.category,
        item.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesSemester && (!query || searchable.includes(query));
    });
  }, [news, searchTerm, semesterFilter, statusFilter]);

  const loadNews = async (
    signal?: AbortSignal,
    options: { forceRefresh?: boolean } = {},
  ) => {
    try {
      setIsLoading(true);
      setError("");
      setNews(await fetchNews(signal, options));
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(loadError instanceof Error ? loadError.message : "Could not load news.");
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (newsItem: NewsRecord) => {
    if (window.confirm(`Delete news article "${newsItem.title}"?`)) {
      try {
        setBusyId(newsItem._id);
        await deleteAdminNews(newsItem._id);
        setNews((prevNews) => prevNews.filter((item) => item._id !== newsItem._id));
        setStatus("News article deleted successfully.");
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : "Could not delete news.");
      } finally {
        setBusyId(null);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadNews(controller.signal);

    return () => controller.abort();
  }, []);

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <LoadingPage label="Loading news admin" />;
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#050505] font-sans text-amber-50">
      <AdminSidebar description="Manage published news articles." />

      <section className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-50/5 bg-[#0a0a0a]/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ff6a1f]" />
            <h2 className="text-lg font-medium tracking-wide text-amber-50/90">
              News management
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
            onClick={() => void loadNews(undefined, { forceRefresh: true })}
          >
            <FaRotateRight />
            Refresh
          </button>
        </div>

        <div className="mx-auto max-w-8xl p-6 md:p-10">
          <div className="mb-6 flex flex-col gap-4 border-b border-amber-50/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
                News workflow
              </p>
              <h1 className="mt-1 text-3xl font-bold text-amber-50">
                {filteredNews.length} articles
              </h1>
              <p className="mt-2 text-sm text-amber-50/55">
                Manage draft, scheduled, and published news articles saved in
                the backend news database.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff6a1f] to-[#e85f1b] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[#ff6a1f]/20"
              onClick={() => navigate("/admin/news/upload")}
            >
              <FaPlus />
              Add news
            </button>
          </div>

          {error && (
            <div className="mb-6">
              <Alert tone="error">{error}</Alert>
            </div>
          )}

          {status && (
            <div className="mb-6">
              <Alert tone="success">{status}</Alert>
            </div>
          )}

          <div className="mb-6 grid gap-3 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 md:grid-cols-[1fr_180px_180px]">
            <input
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20"
              placeholder="Search title, author, category, tags"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <input
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20"
              placeholder="Semester ID"
              value={semesterFilter}
              onChange={(event) => setSemesterFilter(event.target.value)}
            />
          </div>

          <div className="rounded-lg border border-amber-50/10 bg-black">
            <table className="table table-fixed">
              <thead className="bg-zinc-950 text-amber-50/45">
                <tr className="border-amber-50/10">
                  <th className="w-[12%]">Image</th>
                  <th className="w-[30%]">Title</th>
                  <th className="w-[12%]">Status</th>
                  <th className="w-[12%]">Semester</th>
                  <th className="w-[12%]">Flags</th>
                  <th className="w-[16%]">Updated</th>
                  <th className="w-[10%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.length === 0 ? (
                  <tr className="border-amber-50/10">
                    <td colSpan={7} className="py-10 text-center text-sm text-amber-50/55">
                      No news articles found.
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item) => (
                    <tr key={item._id} className="border-amber-50/10 hover:bg-amber-50/5">
                      <td>
                        <img
                          src={item.coverImageUrl || item.thumbNailImage}
                          alt={item.title}
                          className="h-14 w-20 rounded-lg border border-amber-50/10 object-cover"
                        />
                      </td>
                      <td>
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 text-sm font-semibold text-amber-50">
                            {item.title}
                          </h2>
                          <p className="mt-1 line-clamp-2 text-xs text-amber-50/50">
                            {item.summary || item.description}
                          </p>
                          <p className="mt-1 text-xs text-amber-50/35">
                            {item.author}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className="rounded-full border border-amber-50/15 bg-amber-50/5 px-2 py-1 text-xs font-semibold capitalize text-amber-50/80">
                          {item.status || "published"}
                        </span>
                      </td>
                      <td className="text-xs text-amber-50/55">
                        {item.semesterId || "-"}
                      </td>
                      <td className="text-xs text-amber-50/55">
                        {item.isPinned ? "Pinned" : ""}
                        {item.isPinned && item.isFeatured ? " / " : ""}
                        {item.isFeatured ? "Featured" : ""}
                        {!item.isPinned && !item.isFeatured ? "-" : ""}
                      </td>
                      <td className="text-sm text-amber-50/55">
                        {new Date(item.updatedAt || item.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="btn btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                            onClick={() => navigate(`/admin/news/${item._id}/edit`)}
                          >
                            <FaPen />
                          </button>
                          <button
                            type="button"
                            className="btn btn-square btn-sm border-red-500/50 bg-transparent text-red-100 hover:border-red-500/70 hover:bg-red-950/60 disabled:opacity-60"
                            disabled={busyId === item._id}
                            onClick={() => void handleDelete(item)}
                            aria-label={`Delete ${item.title || "news article"}`}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {news.length > 0 && (
            <div className="mt-6">
              <Pagination
                pageSize={pageSize}
                currentPage={currentPage}
                totalCount={news.length}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default NewsAdminPage;
