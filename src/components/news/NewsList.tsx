import { useEffect, useState } from "react";
import { newsData, type NewsItem } from "../../data/newsData";
import NavBar from "../navbar/NavBar";
import Pagination from "../pagination/Pagination";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";

const newsList: NewsItem[] = [...newsData, ...newsData, ...newsData];
const pageSize = 9;

const NewsList = () => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>(newsList.slice(0, pageSize));
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePageChange = () => {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            setNewsItems(newsList.slice(startIndex, endIndex));
        }

        handlePageChange();

        return () => handlePageChange();
    }, [currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleBackToNewsPage = () => {
        navigate("/home#news");
    }

    return (
        <main className="bg-black min-h-screen text-amber-50">
            <NavBar />
            <section className="mx-auto w-4/5 max-w-7xl pt-36">
                <div>
                    <button
                        onClick={handleBackToNewsPage}
                        className="text-md flex items-center ml-6 gap-2 cursor-pointer">
                        <FaArrowLeft size={16} />
                        Back
                    </button>
                </div>
                <div className="text-3xl font-bold w-full max-w-7xl  py-4 lg:pl-6">
                    SRC2026 News
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 p-6">
                    {newsItems.map((newsItem, index) => (
                        <article key={`news-item-${index}-${newsItem.id}`} className="p-6 border rounded-lg bg-amber-50">
                            <h3 className="line-clamp-2 font-semibold text-lg text-[#f27255]">{newsItem.title}</h3>
                            <p className="mt-2 line-clamp-3 text-md h-19 text-black">{newsItem.description}</p>
                            <div className="flex justify-between gap-4">
                                <p className="truncate text-sm mt-2 text-gray-700">{newsItem.author}</p>
                                <p className="shrink-0 text-sm mt-2 text-gray-700">
                                    {new Date(newsItem.date).toLocaleDateString("vi-VN")}
                                </p>
                            </div>
                            <button className="bg-[#f27255] text-white px-4 py-2 rounded mt-4 hover:bg-[#e65c3b] transition-colors duration-300 cursor-pointer">
                                Read
                            </button>
                        </article>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalCount={newsList.length}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </section>
            <Footer />
        </main>
    )
}

export default NewsList;