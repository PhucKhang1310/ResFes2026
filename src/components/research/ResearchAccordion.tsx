import type { ResearchFieldItem } from "../../data/contentData";
import { getResearchIcon } from "../../config/pageCustomization";

interface ResearchAccordionProps {
  activeField: number;
  onAccordionChange: (index: number) => void;
  fields: ResearchFieldItem[];
}

const ResearchAccordion = ({
  activeField,
  onAccordionChange,
  fields,
}: ResearchAccordionProps) => {
  return (
    <div className="flex flex-1 justify-center w-3/4 h-full">
      <div className="join join-vertical rounded-2xl bg-[var(--section-bg)] text-[var(--section-text)]">
        {fields.map((field, index) => {
          const IconComponent = getResearchIcon(field.icon);
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;

          return (
            <div
              key={index}
              className={`collapse collapse-arrow join-item border-b border-[color:var(--section-text)]/10 ${
                isFirst ? "rounded-t-2xl" : ""
              } ${isLast ? "rounded-b-2xl border-b-0" : ""}`}
            >
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === index}
                onChange={() => onAccordionChange(index)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none text-[var(--section-text)]">
                <IconComponent className="shrink-0 text-xl translate-y-px text-[var(--section-accent)]" />
                <span>{field.title}</span>
              </div>
              <div className="collapse-content font-thin text-[var(--section-text)]/80">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  {field.accordionItems.map((item, itemIndex) => (
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
