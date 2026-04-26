import { useState, useRef, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface NewsItem {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
}

const newsData: NewsItem[] = [
    {
        id: 1,
        title: "SRC 2026 KEYNOTE SPEAKER - VU THIEN PHUONG, FATHER OF MILLION-VIEW MVS AND GLOBAL BRANDS CAMPAIGNS",
        description: "Brief description of the news article. Some long description to test text overflow and ellipsis in the news item layout. Some long description to test text overflow and ellipsis in the news item layout. Some long description to test text overflow and ellipsis in the news item layout.",
        author: "Author Name",
        date: "2024-06-01"
    },
    {
        id: 2,
        title: "SRC 2026 REGISTRATION IS NOW OPEN — SUBMIT YOUR RESEARCH TOPICS",
        description: "The Student Research Competition 2026 officially opens registration from January 26 to February 20. Students from all majors at FPT University HCMC are encouraged to participate individually or in groups of up to 3 members.",
        author: "SRC Committee",
        date: "2026-01-26"
    },
    {
        id: 3,
        title: "SCIENTIFIC RESEARCH METHODOLOGY WORKSHOPS — REGISTER NOW",
        description: "Join our guidance workshops on Sunday, March 1st, 2026. Three sessions covering Engineering research methodology, Economics & Social Sciences methodology, and LaTeX/Overleaf reporting will be held at FPTU HCMC.",
        author: "SRC Committee",
        date: "2026-02-15"
    },
    {
        id: 4,
        title: "FULL PAPER SUBMISSION DEADLINE EXTENDED TO APRIL 5, 2026",
        description: "The deadline for submitting full research papers has been extended. All submissions must follow IEEE format (for IT sub-committee) or APA format (for other sub-committees), single-column, maximum 10 A4 pages.",
        author: "SRC Committee",
        date: "2026-03-10"
    },
    {
        id: 5,
        title: "SRC 2026 GRAND FINALE — APRIL 19, 2026",
        description: "The Grand Finale of the Student Research Competition 2026 will be held on April 19. All qualified teams will present their research live. Award ceremony will follow at the end of the event. Attendance is mandatory.",
        author: "SRC Committee",
        date: "2026-04-01"
    },
]

function getClosestIdx(el: HTMLDivElement) {
    const centerX = el.scrollLeft + el.offsetWidth / 2;
    const children = Array.from(el.children) as HTMLElement[];
    let closestIdx = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - centerX);
        if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
        }
    });
    return closestIdx;
}

function scrollToChild(el: HTMLDivElement, idx: number, behavior: ScrollBehavior = "smooth") {
    const child = el.children[idx] as HTMLElement;
    if (!child) return;
    el.scrollTo({
        left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
        behavior,
    });
}

const REAL_COUNT = newsData.length;
const REAL_START = REAL_COUNT;
const loopedNews = [...newsData, ...newsData, ...newsData];

const News = () => {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const isResetting = useRef(false);
    const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasInitialized = useRef(false);

    const initRef = useCallback((node: HTMLDivElement | null) => {
        if (!node || hasInitialized.current) return;
        carouselRef.current = node;
        hasInitialized.current = true;
        requestAnimationFrame(() => scrollToChild(node, REAL_START, "instant"));
    }, []);

    const handleScrollEnd = useCallback(() => {
        const el = carouselRef.current;
        if (!el || isResetting.current) return;
        const idx = getClosestIdx(el);
        if (idx < REAL_START) {
            isResetting.current = true;
            scrollToChild(el, idx + REAL_COUNT, "instant");
            requestAnimationFrame(() => { isResetting.current = false; });
        } else if (idx >= REAL_START + REAL_COUNT) {
            isResetting.current = true;
            scrollToChild(el, idx - REAL_COUNT, "instant");
            requestAnimationFrame(() => { isResetting.current = false; });
        }
    }, []);

    const onScroll = useCallback(() => {
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(handleScrollEnd, 100);
    }, [handleScrollEnd]);

    const handlePrev = useCallback(() => {
        const el = carouselRef.current;
        if (!el || isResetting.current) return;
        scrollToChild(el, Math.max(0, getClosestIdx(el) - 1));
    }, []);

    const handleNext = useCallback(() => {
        const el = carouselRef.current;
        if (!el || isResetting.current) return;
        scrollToChild(el, Math.min(el.children.length - 1, getClosestIdx(el) + 1));
    }, []);

    return (
        <section id="news" className="flex flex-col items-center justify-center p-4 rounded-lg text-black scroll-mt-24 mt-10">
            <div className="mb-10 text-center w-2/3">
                <h2 className="text-4xl font-bold text-black lg:text-5xl">News</h2>
                <div className="mt-3 font-thin text-sm text-black/70 lg:text-base">
                    <p className="divider divider-neutral">Latest news about SRC2026</p>
                </div>
            </div>

            {/* Full-width looping carousel with nav arrows */}
            <div className="relative w-3/4 mx-auto">
                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous news"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 backdrop-blur-md border border-black/10 flex items-center justify-center text-black/60 hover:bg-black/20 transition-all duration-300 cursor-pointer hover:scale-110"
                >
                    <FaChevronLeft className="text-sm sm:text-base" />
                </button>
                <button
                    onClick={handleNext}
                    aria-label="Next news"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 backdrop-blur-md border border-black/10 flex items-center justify-center text-black/60 hover:bg-black/20 transition-all duration-300 cursor-pointer hover:scale-110"
                >
                    <FaChevronRight className="text-sm sm:text-base" />
                </button>

                <div
                    ref={initRef}
                    onScroll={onScroll}
                    className="carousel carousel-center w-full space-x-4 p-4 px-12 sm:px-16"
                >
                    {loopedNews.map((newsItem, i) => (
                        <div className="carousel-item" key={`${newsItem.id}-${i}`}>
                            <article className="p-6 border rounded-lg w-[75vw] max-w-sm">
                                <h3 className="line-clamp-2 font-semibold text-lg text-[#f27255]">{newsItem.title}</h3>
                                <p className="mt-2 line-clamp-3 text-md h-19">{newsItem.description}</p>
                                <div className="flex justify-between gap-4">
                                    <p className="truncate text-sm mt-2 text-gray-700">{newsItem.author}</p>
                                    <p className="shrink-0 text-sm mt-2 text-gray-700">
                                        {new Date(newsItem.date).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                                <button
                                    className="bg-[#f27255] text-white px-4 py-2 rounded mt-4 hover:bg-[#e65c3b] transition-colors duration-300 cursor-pointer"
                                    onClick={() => setSelectedNews(newsItem)}
                                >
                                    Read more
                                </button>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Detail Overlay Modal */}
            {selectedNews && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedNews(null)}
                >
                    <div
                        className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-lg"
                            onClick={() => setSelectedNews(null)}
                        >
                            ✕
                        </button>

                        <h3 className="text-xl sm:text-2xl font-bold text-[#f27255] pr-8 leading-snug">
                            {selectedNews.title}
                        </h3>

                        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                            <span>{selectedNews.author}</span>
                            <span>•</span>
                            <span>{new Date(selectedNews.date).toLocaleDateString("vi-VN")}</span>
                        </div>

                        <div className="divider" />

                        <div className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                            {selectedNews.description}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default News;