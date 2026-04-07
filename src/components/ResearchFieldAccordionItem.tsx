import type { ReactNode } from "react";

type ResearchFieldAccordionItemProps = {
  index: number;
  activeIndex: number;
  title: string;
  icon: ReactNode;
  items: string[];
  onChange: (index: number) => void;
  radioName: string;
  className?: string;
};

const ResearchFieldAccordionItem = ({
  index,
  activeIndex,
  title,
  icon,
  items,
  onChange,
  radioName,
  className = "",
}: ResearchFieldAccordionItemProps) => {
  return (
    <div
      className={`collapse collapse-arrow join-item border-base-300 border ${className}`.trim()}
    >
      <input
        type="radio"
        name={radioName}
        checked={activeIndex === index}
        onChange={() => onChange(index)}
      />
      <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none">
        {icon}
        <span>{title}</span>
      </div>
      <div className="collapse-content font-thin">
        <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResearchFieldAccordionItem;
