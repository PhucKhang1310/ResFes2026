import {
  FaChartLine,
  FaLanguage,
  FaLaptopCode,
  FaPalette,
} from "react-icons/fa6";

interface ResearchAccordionProps {
  activeField: number;
  onAccordionChange: (index: number) => void;
}

const ResearchAccordion = ({
  activeField,
  onAccordionChange,
}: ResearchAccordionProps) => {
  const fields = [
    {
      icon: FaLaptopCode,
      title: "Information Technology, Semiconductor IC and Digital Automotive",
      items: [
        "Information Technology",
        "Semiconductor IC",
        "Digital Automotive",
      ],
    },
    {
      icon: FaPalette,
      title: "Graphic Design and Multimedia Communication",
      items: ["Graphic Design", "Multimedia Communication"],
    },
    {
      icon: FaChartLine,
      title: "Economics and Business Administration",
      items: ["Economics", "Business Administration"],
    },
    {
      icon: FaLanguage,
      title: "English Language",
      items: ["English Language Studies and research topics"],
    },
    {
      icon: FaLanguage,
      title: "Japanese Language",
      items: ["Japanese Language Studies and research topics"],
    },
  ];

  return (
    <div className="flex flex-1 justify-center w-3/4 h-full">
      <div className="join join-vertical bg-amber-50 rounded-2xl text-black">
        {fields.map((field, index) => {
          const IconComponent = field.icon;
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;

          return (
            <div
              key={index}
              className={`collapse collapse-arrow join-item border-b border-black/10 ${
                isFirst ? "rounded-t-2xl" : ""
              } ${isLast ? "rounded-b-2xl border-b-0" : ""}`}
            >
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === index}
                onChange={() => onAccordionChange(index)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none text-black">
                <IconComponent className="shrink-0 text-xl translate-y-px" />
                <span>{field.title}</span>
              </div>
              <div className="collapse-content font-thin text-black">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  {field.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResearchAccordion;
