import AboutUs from "./components/about/AboutUs";
import Awards from "./components/awards/Awards";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Milestones from "./components/milestones/Milestones";
import NavBar from "./components/navbar/NavBar";
import Regulations from "./components/regulations/Regulations";
import ResearchFields from "./components/research/ResearchFields";
import Workshops from "./components/workshops/Workshops";
import LazyWrapper from "./components/wrapper/LazyWrapper";

const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <AboutUs />
      
      <ResearchFields />
      <Awards />
      <LazyWrapper id="regulations">
        <Regulations />
      </LazyWrapper>
      <LazyWrapper id="milestones">
        <Milestones />
      </LazyWrapper>
      <LazyWrapper id="workshops">
        <Workshops />
      </LazyWrapper>
      <Footer />
    </>
  );
};
export default App;
