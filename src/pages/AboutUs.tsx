import { useEffect, useRef, useState } from "react";
import resfesPlasma from "../assets/resfes_plasma.jpg";
import resfesTour from "../assets/resfes_tour.jpg";
import resfesWind from "../assets/resfes_wind.jpg";
import resfesMentor from "../assets/resfes_mentor.jpg";
import resfesNhut from "../assets/resfes_nhut.jpg";
import SectionMarker from "../components/SectionMarker";

const AboutUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const images = [
    resfesPlasma,
    resfesTour,
    resfesWind,
    resfesMentor,
    resfesNhut,
  ];

  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const carousel = e.currentTarget;
    const itemHeight = carousel.scrollHeight / images.length;
    const activeIdx = Math.round(carousel.scrollTop / itemHeight);
    setActiveIndex(Math.min(activeIdx, images.length - 1));
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;

        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            top: nextIndex * carouselRef.current.clientHeight,
            behavior: "smooth",
          });
        }

        return nextIndex;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [images.length]);

  return (
    <div
      id="about"
      className="flex bg-white flex-col justify-center items-center pb-10 scroll-mt-24"
    >
      <SectionMarker
        label="ABOUT RESFES 2026"
        className="mt-20 text-xl text-black"
        iconWidth={15}
        fillColor="#000000"
      />

      <div className="flex w-3/4 mt-20 items-center">
        <div className="flex flex-1 gap-4 items-center justify-start">
          <div className="flex flex-col gap-2 justify-center">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-6 rounded transition-all ${
                  index === activeIndex
                    ? "bg-gray-800 opacity-100"
                    : "bg-gray-300 opacity-50"
                }`}
              />
            ))}
          </div>
          <div
            ref={carouselRef}
            className="carousel carousel-vertical rounded-box h-[90vh]"
            onScroll={handleCarouselScroll}
          >
            {images.map((image, index) => (
              <div key={index} className="carousel-item h-full">
                <img src={image} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 pl-8">
          <h3 className="text-3xl font-bold leading-tight text-black">
            Research-Based Learning, Real-World Impact
          </h3>
          <p className="text-base leading-8 text-black/75">
            <span className="font-semibold text-black">
              Research-Based Learning (RBL)
            </span>{" "}
            places students at the center of educational activity, shifting the
            focus from teacher-centered delivery to student-driven inquiry.
            Through active research practice, students strengthen core skills in
            problem definition, data collection, analysis, and evidence-based
            explanation.
          </p>
          <p className="text-base leading-8 text-black/75">
            At{" "}
            <span className="font-semibold text-black">
              Research Festival 2026
            </span>
            , students are encouraged to move from passive learners to active
            participants in the scientific journey. ResFes 2026 integrates RBL
            into major-specific curricula to cultivate practical, relevant
            capabilities for each field.
          </p>
          <p className="text-base leading-8 text-black/75">
            We encourage research teams across majors and sub-committees to
            apply research-based learning in authentic contexts, equipping
            students with the mindset and skills needed to meet evolving
            industry demands.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
