import { useEffect } from "react";
import AboutUs from "./components/about/AboutUs";
import Awards from "./components/awards/Awards";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Milestones from "./components/milestones/Milestones";
import NavBar from "./components/navbar/NavBar";
import Regulations from "./components/regulations/Regulations";
import ResearchFields from "./components/research/ResearchFields";
import News from "./components/news/News";
import Workshops from "./components/workshops/Workshops";
import LazyWrapper from "./components/wrapper/LazyWrapper";

const App = () => {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
      <NavBar />
      <Hero />
      <AboutUs />
      <ResearchFields />
      <Awards />
      <Regulations />
      <Milestones />
      <News />
      <LazyWrapper id="workshops">
        <Workshops />
      </LazyWrapper>
      <Footer />
    </>
  );
};
export default App;
