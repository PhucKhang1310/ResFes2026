import { useState } from "react";
import resfesPlasma from "../../assets/resfes_plasma.jpg";
import resfesTour from "../../assets/resfes_tour.jpg";
import resfesWind from "../../assets/resfes_wind.jpg";
import resfesMentor from "../../assets/resfes_mentor.jpg";
import { useFadeIn } from "../../hook/useFadeIn";
import { useCheckMobile } from "../../hook/useCheckMobile";
import { FaChevronDown } from "react-icons/fa6";
import { usePageContent } from "../../hook/usePageContent";
import {
  getContentSectionStyle,
  sectionCssVars,
} from "../../config/pageCustomization";

const AboutUs = () => {
  const { isMobile } = useCheckMobile();
  const { content } = usePageContent();
  const about = content?.about;
  const sectionStyle = getContentSectionStyle(content, "about");
  const [showMore, setShowMore] = useState(isMobile ? false : true);
  const images =
    about && about.images.length > 0
      ? about.images
      : [
          { id: 1, url: resfesPlasma, alt: "SRC research showcase" },
          { id: 2, url: resfesTour, alt: "SRC campus tour" },
          { id: 3, url: resfesWind, alt: "SRC wind research" },
          { id: 4, url: resfesMentor, alt: "SRC mentor guidance" },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const { inView, ref } = useFadeIn();

  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const carousel = e.currentTarget;
    const itemHeight = carousel.scrollHeight / images.length;
    const activeIdx = Math.round(carousel.scrollTop / itemHeight);
    setActiveIndex(Math.min(activeIdx, images.length - 1));
  };

  const handleCarouselScrollHorizontal = (e: React.UIEvent<HTMLDivElement>) => {
    const carousel = e.currentTarget;
    const itemWidth = carousel.scrollWidth / images.length;
    const activeIdx = Math.round(carousel.scrollLeft / itemWidth);
    setActiveIndex(Math.min(activeIdx, images.length - 1));
  };

  if (!about) {
    return null;
  }

  const renderCarousel = () => {
    if (isMobile) {
      return (
        <div className="flex flex-col w-3/4 mt-20 items-center">
          <div
            className={`flex flex-col flex-1 gap-4 items-center justify-start`}
          >
            <div
              className="carousel carousel-horizontal rounded-box h-[90vh]"
              onScroll={handleCarouselScrollHorizontal}
            >
              {images.map((image) => (
                <div key={image.id} className="carousel-item w-full h-full">
                  <img className="object-cover" src={image.url} alt={image.alt} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-center mt-4 mb-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-1 rounded transition-all ${
                    index === activeIndex
                      ? "bg-[var(--section-accent)] opacity-100"
                      : "bg-[var(--section-text)] opacity-25"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 pl-8">
            <h3 className="text-3xl font-bold leading-tight text-[var(--section-text)]">
              {about.title}
            </h3>
            <p className="text-base leading-8 text-[var(--section-text)]/75">
              <span className="font-semibold text-[var(--section-text)]">
                {about.highlightOne}
              </span>{" "}
              {about.paragraphOne}
            </p>
            {!showMore ? (
              <div className="">
                <p className="text-base leading-8 text-[var(--section-text)]/75">
                  At{" "}
                  <span className="font-semibold text-[var(--section-text)]">
                    {about.highlightTwo}
                  </span>
                  , {about.paragraphTwo}
                </p>
                <p className="text-base leading-8 text-[var(--section-text)]/75">
                  {about.paragraphThree}
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <FaChevronDown
                  onClick={() => setShowMore(!showMore)}
                  className="text-[var(--section-text)]"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-3/4 mt-20 items-center">
        <div className={`flex flex-1 gap-4 items-center justify-start`}>
          <div className="flex flex-col gap-2 justify-center">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-6 rounded transition-all ${
                  index === activeIndex
                    ? "bg-[var(--section-accent)] opacity-100"
                    : "bg-[var(--section-text)] opacity-25"
                }`}
              />
            ))}
          </div>
          <div
            className="carousel carousel-vertical rounded-box h-[90vh]"
            onScroll={handleCarouselScroll}
          >
            {images.map((image) => (
              <div key={image.id} className="carousel-item h-full">
                <img className="object-cover" src={image.url} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 pl-8">
          <h3 className="text-3xl font-bold leading-tight text-[var(--section-text)]">
            {about.title}
          </h3>
          <p className="text-base leading-8 text-[var(--section-text)]/75">
            <span className="font-semibold text-[var(--section-text)]">
              {about.highlightOne}
            </span>{" "}
            {about.paragraphOne}
          </p>
          <p className="text-base leading-8 text-[var(--section-text)]/75">
            At{" "}
            <span className="font-semibold text-[var(--section-text)]">
              {about.highlightTwo}
            </span>
            , {about.paragraphTwo}
          </p>
          <p className="text-base leading-8 text-[var(--section-text)]/75">
            {about.paragraphThree}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      id="about"
      style={sectionCssVars(sectionStyle)}
      className={`flex bg-[var(--section-bg)] text-[var(--section-text)] flex-col justify-center items-center pb-10 scroll-mt-24 
        ${inView ? "fade-in" : "opacity-0"}`}
    >
      <span className="mt-20 font-extrabold text-xl text-[var(--section-text)] flex gap-3">
        <svg
          viewBox="0 0 292.828 292.828"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
        >
          <polygon
            points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
            fill="currentColor"
          />
        </svg>
        {about.sectionLabel}
      </span>

      {renderCarousel()}
    </div>
  );
};
export default AboutUs;
