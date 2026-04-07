import {
  FaChartLine,
  FaFilm,
  FaLanguage,
  FaLaptopCode,
  FaPalette,
} from "react-icons/fa6";
import { useRef, useState } from "react";
import ResearchFieldAccordionItem from "../components/ResearchFieldAccordionItem";
import ResearchFieldDetailCard from "../components/ResearchFieldDetailCard";
import SectionMarker from "../components/SectionMarker";

const fieldAccordionItems = [
  {
    title: "Information Technology",
    icon: <FaLaptopCode className="shrink-0 text-xl translate-y-px" />,
    items: [
      "Automotive Technology",
      "Artificial Intelligence",
      "Software Engineering",
      "Information System",
      "Information Assurance",
      "Applied Data Science",
      "IC Design",
      "Other related fields",
    ],
  },
  {
    title: "Digital Art and Design",
    icon: <FaPalette className="shrink-0 text-xl translate-y-px" />,
    items: ["Digital Art and Design", "Graphic Design", "Other related fields"],
  },
  {
    title: "Communication Technology",
    icon: <FaFilm className="shrink-0 text-xl translate-y-px" />,
    items: [
      "Multimedia Communication",
      "Public Relations",
      "Integrated Marketing Communication",
      "Brand Communication",
      "Other related fields",
    ],
  },
  {
    title: "Business Administration",
    icon: <FaChartLine className="shrink-0 text-xl translate-y-px" />,
    items: [
      "Marketing",
      "International Business",
      "Business Administration",
      "Business Analytics",
      "Logistics & Global Supply Chain Management",
      "Fin-Tech",
      "Law",
      "Eco-Law",
      "Other related fields",
    ],
  },
  {
    title: "Linguistics",
    icon: <FaLanguage className="shrink-0 text-xl translate-y-px" />,
    items: ["English", "Korean", "Chinese", "Other related fields"],
  },
];

const fieldDetailItems = [
  {
    title: "Information Technology: Experimenting with Emerging Technologies",
    leadLabel: "What you'll do:",
    points: [
      "Student-led AI and data science research driven by real-world problems",
      "Prototyping intelligent applications through research-based experimentation",
      "Cybersecurity experiments and ethical hacking labs",
      "IoT and edge AI systems developed through inquiry-based learning",
      "Safe, responsible, and explainable AI research",
      "Quantum Machine Learning exploration through simulation and hybrid models",
      "Research-based design and evaluation of digital and AI-oriented chips",
    ],
  },
  {
    title: "Digital Art & Design: Design Thinking Informed by Research",
    points: [
      "Research-driven visual communication design",
      "Human-AI co-creation in design studios",
      "User-experience testing and evidence-based design",
      "Cultural research in visual identity creation",
      "Sustainable design experiments",
      "Data, measurement in Design",
      "Emerging modalities and embodied experience (e.g. VR, XR, ...)",
      "Service Design",
    ],
  },
  {
    title: "Communication Technology: Exploring Media Innovation",
    points: [
      "Interactive & Immersive Storytelling (AR/VR, 360-degree video, interactive narratives)",
      "Short-form Visual Communication",
      "AI-mediated Multimedia Communication (AI-generated content, Human vs. AI communicator)",
      "Ethical & Responsible Multimedia Communication",
      "Fake News, Visual Misinformation & Deepfakes",
      "CSR & Sustainability Communication in Multimedia Contexts",
    ],
  },
  {
    title: "Business Administration: Business Insight through Inquiry",
    points: [
      "Student research on digital business models",
      "Data-driven market analysis projects",
      "Startup experiments and lean validation research",
      "Consumer behavior investigation",
      "ESG and sustainability strategy research",
      "Policy makers and economic developments",
      "Policy makers and ESG/Environmental/Green practices - drivers and consequences",
      "Stock market exchanges: implications for the authority",
    ],
  },
  {
    title: "Linguistics: Discovering Language through Inquiry",
    points: [
      "Corpus-based language research projects",
      "Comparative linguistics",
      "AI-assisted language learning experiments",
      "Discourse analysis in digital communication",
      "Translation studies using real datasets",
      "Language and culture research in global contexts",
    ],
  },
];

const ResearchFields = () => {
  const [activeField, setActiveField] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleAccordionChange = (index: number) => {
    setActiveField(index);

    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        top: index * carouselRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) {
      return;
    }

    const index = Math.round(
      carouselRef.current.scrollTop / carouselRef.current.clientHeight
    );

    if (index !== activeField) {
      setActiveField(index);
    }
  };

  return (
    <div
      id="research-fields"
      className="flex flex-col justify-center items-center mt-10 pb-20 bg-black scroll-mt-24"
    >
      <SectionMarker
        label="RESEARCH FIELDS"
        className="mt-20 text-sm text-white"
      />
      <div className="flex gap-10 mt-10 items-center">
        <div className="flex flex-1 justify-center w-3/4 h-full">
          <div className="join join-vertical bg-white rounded-2xl text-black">
            {fieldAccordionItems.map((field, index) => (
              <ResearchFieldAccordionItem
                key={field.title}
                index={index}
                activeIndex={activeField}
                title={field.title}
                icon={field.icon}
                items={field.items}
                onChange={handleAccordionChange}
                radioName="research-fields-accordion"
                className={`${index === 0 ? "rounded-t-2xl" : ""} ${
                  index === fieldAccordionItems.length - 1
                    ? "rounded-b-2xl"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div
            ref={carouselRef}
            className="carousel carousel-vertical rounded-box h-[50vh]"
            onScroll={handleCarouselScroll}
          >
            {fieldDetailItems.map((field) => (
              <div key={field.title} className="carousel-item h-full">
                <ResearchFieldDetailCard
                  title={field.title}
                  leadLabel={field.leadLabel}
                  points={field.points}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResearchFields;
