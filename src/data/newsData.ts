export interface NewsItem {
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
        title: "SCIENTIFIC RESEARCH METHODOLOGY WORKSHOPS — REGISTER NOW",
        description: "Join our guidance workshops on Sunday, March 1st, 2026. Three sessions covering Engineering research methodology, Economics & Social Sciences methodology, and LaTeX/Overleaf reporting will be held at FPTU HCMC.",
        author: "SRC Committee",
        date: "2026-02-15"
    }
]

export { newsData }