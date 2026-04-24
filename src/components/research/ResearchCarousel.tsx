import type { RefObject } from "react";

interface ResearchCarouselProps {
  carouselRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

const ResearchCarousel = ({ carouselRef, onScroll }: ResearchCarouselProps) => {
  const carouselItems = [
    {
      title: "Information Technology, Semiconductor IC and Digital Automotive",
      items: [
        "AI-powered campus assistant for student services and advising",
        "Low-power semiconductor prototype for edge sensing workloads",
        "Digital twin simulation for predictive automotive maintenance",
        "Secure IoT architecture for smart classroom infrastructure",
      ],
    },
    {
      title: "Graphic Design and Multimedia Communication",
      items: [
        "Brand identity system for science communication campaigns",
        "Short-form multimedia storytelling for public research impact",
        "Accessible infographic design for technical findings",
        "Cross-platform motion graphics for event promotion",
      ],
    },
    {
      title: "Economics and Business Administration",
      items: [
        "Consumer behavior analysis for education technology adoption",
        "Financial feasibility model for student-led startup ideas",
        "Operations optimization for campus service workflows",
        "Market entry strategy for sustainable youth-focused products",
      ],
    },
    {
      title: "English Language",
      items: [
        "Project-based English writing outcomes in research contexts",
        "Academic presentation anxiety and speaking performance factors",
        "Corpus-informed vocabulary development for undergraduates",
        "Peer feedback patterns in collaborative language learning",
      ],
    },
    {
      title: "Japanese Language",
      items: [
        "Pragmatics in Japanese business email communication",
        "Kanji retention improvement through spaced repetition methods",
        "Intercultural communication challenges in JP-VN teamwork",
        "Role-play-based speaking fluency in beginner cohorts",
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
            <div className="card h-full w-[40vw] overflow-hidden rounded-2xl bg-transparent text-black">
              <div className="card-body min-h-0 overflow-hidden">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">{item.title}</h2>
                </div>
                <ul className="mt-6 flex min-h-0 flex-col gap-2 overflow-hidden pl-5 text-lg font-thin list-disc">
                  {item.items.map((listItem, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="whitespace-nowrap"
                    >
                      <span className="block truncate">{listItem}</span>
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
