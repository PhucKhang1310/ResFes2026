import { useInView } from "react-intersection-observer";
import ResearchAccordion from "./ResearchAccordion";
import type { PageSectionStyle, ResearchFieldItem } from "../../data/contentData";
import { sectionCssVars } from "../../config/pageCustomization";

interface ResearchFieldsMobileProps {
  activeField: number;
  onAccordionChange: (index: number) => void;
  fields: ResearchFieldItem[];
  title: string;
  sectionStyle: PageSectionStyle;
}

const ResearchFieldsMobile = ({
  activeField,
  onAccordionChange,
  fields,
  title,
  sectionStyle,
}: ResearchFieldsMobileProps) => {
  const { ref, inView } = useInView();

  return (
    <div
      id="research-fields"
      ref={ref}
      style={sectionCssVars(sectionStyle)}
      className={`flex flex-col justify-center items-center pt-10 pb-20 bg-[var(--section-bg)] text-[var(--section-text)] scroll-mt-24
        ${inView ? "fade-in" : "opacity-0"}`}
    >
      <span className="divider before:bg-[var(--section-text)]/60 after:bg-[var(--section-text)]/60 mt-20 font-extrabold text-sm text-[var(--section-text)] flex gap-3 w-3/4 self-center">
        <svg
          viewBox="0 0 292.828 292.828"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
        >
          <polygon
            points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
            fill="currentColor"
          />
        </svg>
        {title}
      </span>
      <>
        <ResearchAccordion
          activeField={activeField}
          onAccordionChange={onAccordionChange}
          fields={fields}
        />
      </>
    </div>
  );
};

export default ResearchFieldsMobile;
