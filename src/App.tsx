import AboutUs from "./pages/AboutUs";
import Awards from "./pages/Awards";
import Footer from "./pages/Footer";
import Hero from "./pages/Hero";
import Milestones from "./pages/Milestones";
import NavBar from "./pages/NavBar";
import Regulations from "./pages/Regulations";
import ResearchFields from "./pages/ResearchFields";
import Workshops from "./pages/Workshops";

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
