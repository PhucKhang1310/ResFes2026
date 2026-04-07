import AboutUs from "./components/AboutUs";
import Awards from "./components/Awards";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Milestones from "./components/Milestones";
import NavBar from "./components/NavBar";
import Regulations from "./components/Regulations";
import ResearchFields from "./components/ResearchFields";
import Workshops from "./components/Workshops";

const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <AboutUs />
      <ResearchFields />
      <Awards />
      <Regulations />
      <Milestones />
      <Workshops />
      <Footer />
    </>
  );
};
export default App;
