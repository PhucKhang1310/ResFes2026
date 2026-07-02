import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { fetchNews, type NewsRecord } from "../../api/newsApi";
import srcLogo from "../../assets/logo_src_white_nobg.png";
import { useCheckMobile } from "../../hook/useCheckMobile";
import { usePageContent } from "../../hook/usePageContent";
import LoadingPage from "../../components/loading/LoadingPage";
import {
  getContentSectionStyle,
  sectionCssVars,
} from "../../config/pageCustomization";

const getNewsImage = (newsItem: NewsRecord) =>
  newsItem.thumbNailImage || newsItem.images[0] || srcLogo;

const News = () => {
  const { isMobile } = useCheckMobile();
  const navigate = useNavigate();
  const { content } = usePageContent();
  const sectionStyle = getContentSectionStyle(content, "news");
  const newsReadAllLabel = content?.newsReadAllLabel ?? "Read all news";
  const newsSubtitle = content?.newsSubtitle ?? "Latest news about SRC2026";
  const newsTitle = content?.newsTitle ?? "News";
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadNews = async () => {
      try {
        setIsLoading(true);
        setError("");
        setNews(await fetchNews(controller.signal));
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load news.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadNews();

    return () => controller.abort();
  }, []);

  const topStory = news[0];

  if (!isLoading && !topStory && !error) {
    return null;
  }

  if (isLoading) {
    return <LoadingPage label="Loading news" />;
  }

  return (
    <section
      id="news"
      style={sectionCssVars(sectionStyle)}
      className="mt-10 flex scroll-mt-24 flex-col items-center justify-center rounded-lg bg-[var(--section-bg)] p-4 text-[var(--section-text)]"
    >
      <div className="mb-10 w-4/5 text-center">
        <h2 className="text-4xl font-bold text-[var(--section-text)] lg:text-5xl">{newsTitle}</h2>
        <div className="mt-3 text-sm font-thin text-[var(--section-text)]/70 lg:text-base">
          <p className="divider before:bg-[var(--section-text)]/30 after:bg-[var(--section-text)]/30">{newsSubtitle}</p>
        </div>
      </div>

      {error ? (
        <p className="w-4/5 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : topStory ? (
        isMobile ? (
          <div className="w-4/5 max-w-xl">
            <button
              type="button"
              onClick={() => navigate(`/news-list/${topStory._id}`)}
              className="w-full text-left"
            >
              <img
                src={getNewsImage(topStory)}
                alt={topStory.title}
                className="h-64 w-full object-cover"
              />
            </button>

            <div className="mt-6 space-y-4">
              {news.slice(1, 4).map((newsItem) => (
                <button
                  key={`mobile-news-${newsItem._id}`}
                  type="button"
                  onClick={() => navigate(`/news-list/${newsItem._id}`)}
                  className="flex w-full items-start gap-4 text-left"
                >
                  <img
                    src={getNewsImage(newsItem)}
                    alt={newsItem.title}
                    className="h-20 w-28 shrink-0 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-semibold text-[var(--section-text)]">
                      {newsItem.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="mt-6 w-full cursor-pointer rounded py-2 text-left text-[var(--section-accent)]"
              onClick={() => navigate("/news-list")}
            >
              {newsReadAllLabel}
              <FaArrowRight className="ml-2 inline-block" />
            </button>
          </div>
        ) : (
          <div className="relative mx-auto w-2/3">
            <div className="flex w-full items-stretch gap-4">
              <a href={`/news-list/${topStory._id}`} className="flex flex-1 flex-col p-2 pt-0">
                <img
                  src={getNewsImage(topStory)}
                  alt={topStory.title}
                  className="w-full flex-1 object-cover"
                />
                <span className="mt-4 block text-lg font-semibold">
                  {topStory.title}
                </span>
                <p className="text-md mt-2 line-clamp-2 text-[var(--section-text)]/60">
                  {topStory.description}
                </p>
              </a>

              <div className="flex flex-1 flex-col justify-between p-2 pt-0 gap-3">
                {news.slice(1, 4).map((newsItem) => (
                  <a
                    key={`news-item-${newsItem._id}`}
                    href={`/news-list/${newsItem._id}`}
                    className="flex gap-4"
                  >
                    <img
                      src={getNewsImage(newsItem)}
                      alt={newsItem.title}
                      className="h-35 w-55 shrink-0 object-cover"
                    />
                    <div className="flex flex-col justify-start gap-1">
                      <span className="line-clamp-3 font-semibold">
                        {newsItem.title}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm">{newsItem.author}</span>
                        <span className="font-thin">
                          {new Date(newsItem.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
                <button
                  type="button"
                  className="cursor-pointer self-start rounded text-[var(--section-accent)] hover:underline"
                  onClick={() => navigate("/news-list")}
                >
                  {newsReadAllLabel}
                  <FaArrowRight className="ml-2 inline-block" />
                </button>
              </div>
            </div>
          </div>
        )
      ) : null}
    </section>
  );
};

export default News;
