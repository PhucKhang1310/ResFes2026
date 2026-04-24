import { Link } from "react-router-dom";

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
        title: "RESFES 2025 KEYNOTE SPEAKER - VU THIEN PHUONG, FATHER OF MILLION-VIEW MVS AND GLOBAL BRANDS CAMPAIGNS",
        description: "Brief description of the news article. Some long description to test text overflow and ellipsis in the news item layout. Some long description to test text overflow and ellipsis in the news item layout. Some long description to test text overflow and ellipsis in the news item layout.",
        author: "Author Name",
        date: "2024-06-01"
    },
    {
        id: 2,
        title: "RESFES 2025 KEYNOTE SPEAKER - VU THIEN PHUONG, FATHER OF MILLION-VIEW MVS AND GLOBAL BRANDS CAMPAIGNS",
        description: "Brief description of the news article.",
        author: "Author Name",
        date: "2024-06-01"
    },
]

const News = () => {

    const renderNewsItem = (newsArray: typeof newsData) => {
        return newsArray.map((newsItem) => (
            <article key={newsItem.id} className="p-6 border rounded-lg mt-4">
                <h3 className="line-clamp-2 font-semibold text-lg text-[#f27255]">{newsItem.title}</h3>
                <p className="mt-2 line-clamp-3 text-md h-19">{newsItem.description}</p>
                <div className="flex justify-between gap-4">
                    <p className="truncate text-sm mt-2 text-gray-700">{newsItem.author} </p>
                    <p className="shrink-0 text-sm mt-2 text-gray-700">
                        {new Date(newsItem.date).toLocaleDateString("vi-VN")}
                    </p>
                </div>
                <button className="bg-[#f27255] text-white px-4 py-2 rounded mt-4 hover:bg-[#e65c3b] transition-colors duration-300">
                    Read more
                </button>
            </article>
        ));
    }

    return (
        <section id="news" className="flex flex-col items-center justify-center p-4 rounded-lg  text-black scroll-mt-24 mt-10">
            <div className="mb-10 text-center w-2/3">
                <h2 className="text-4xl font-bold text-black lg:text-5xl">News</h2>
                <div className="mt-3 font-thin text-sm text-black/70 lg:text-base ">
                    <p className="divider divider-neutral">Latest news about ResFes2026</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 w-2/3">
                {renderNewsItem(newsData)}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-sm font-semibold text-black/80">
                    Want to learn more about ResFes2026?
                </p>
                <Link
                    to="/news"
                    className="bg-[#f27255] text-white px-4 py-2 rounded hover:bg-[#e65c3b] transition-colors duration-300"
                >
                    View all news
                </Link>
            </div>
        </section>

    )
}

export default News;