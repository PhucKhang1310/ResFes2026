import { useInView } from "react-intersection-observer";
import ResearchAccordion from "./ResearchAccordion";

const ResearchFieldsMobile = ({ activeField, onAccordionChange }) => {
    const { ref, inView } = useInView();

    return (
        <div
            id="research-fields"
            ref={ref}
            className={`flex flex-col justify-center items-center pt-10 pb-20 bg-amber-50 scroll-mt-24
        ${inView ? "fade-in" : "opacity-0"}`}
        >
            <span className="divider before:bg-black/60 after:bg-black/60 mt-20 font-extrabold text-sm text-black flex gap-3 w-3/4 self-center">
                <svg
                    viewBox="0 0 292.828 292.828"
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                >
                    <polygon
                        points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
                        fill="#000000"
                    />
                </svg>
                RESEARCH FIELDS
            </span>
            <>
                <ResearchAccordion
                    activeField={activeField}
                    onAccordionChange={onAccordionChange}
                />
            </>
        </div>
    );
};


export default ResearchFieldsMobile;
