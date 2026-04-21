import type { RefObject } from "react";

interface ResearchCarouselProps {
  carouselRef: RefObject<HTMLDivElement>;
  onScroll: () => void;
}

const ResearchCarousel = ({ carouselRef, onScroll }: ResearchCarouselProps) => {
  const carouselItems = [
    {
      title: "Information Technology: Experimenting with Emerging Technologies",
      items: [
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
      items: [
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
      title: "Business Administration: Business Insight through Inquiry",
      items: [
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
      title: "Communication Technology: Exploring Media Innovation",
      items: [
        "Interactive & Immersive Storytelling (AR/VR, 360-degree video, interactive narratives)",
        "Short-form Visual Communication",
        "AI-mediated Multimedia Communication (AI-generated content, Human vs. AI communicator)",
        "Ethical & Responsible Multimedia Communication",
        "Fake News, Visual Misinformation & Deepfakes",
        "CSR & Sustainability Communication in Multimedia Contexts",
      ],
    },
    {
      title: "Linguistics: Discovering Language through Inquiry",
      items: [
        "Corpus-based language research projects",
        "Comparative linguistics",
        "AI-assisted language learning experiments",
        "Discourse analysis in digital communication",
        "Translation studies using real datasets",
        "Language and culture research in global contexts",
      ],
    },
  ];

  return (
    <div className="flex-1">
      <div
        ref={carouselRef}
        className="carousel carousel-vertical rounded-box h-[50vh]"
        onScroll={onScroll}
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="carousel-item h-full">
            <div className="card w-[40vw] bg-transparent text-black rounded-2xl">
              <div className="card-body">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">{item.title}</h2>
                </div>
                <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
                  {index === 0 && (
                    <h2 className="-ml-5 font-bold">What you'll do:</h2>
                  )}
                  {item.items.map((listItem, itemIndex) => (
                    <li key={itemIndex}>
                      <span>{listItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchCarousel;
