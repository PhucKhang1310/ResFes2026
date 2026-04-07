import type { ReactNode } from "react";

type RadioAccordionItemProps = {
  radioName: string;
  title: string;
  children: ReactNode;
  defaultChecked?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

const RadioAccordionItem = ({
  radioName,
  title,
  children,
  defaultChecked = false,
  className = "",
  titleClassName = "",
  contentClassName = "",
}: RadioAccordionItemProps) => {
  return (
    <div
      className={`collapse collapse-arrow join-item border-b border-black/10 ${className}`.trim()}
    >
      <input type="radio" name={radioName} defaultChecked={defaultChecked} />
      <div
        className={`collapse-title text-xl font-bold ${titleClassName}`.trim()}
      >
        {title}
      </div>
      <div
        className={`collapse-content text-sm leading-7 text-black/80 ${contentClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
};

export default RadioAccordionItem;
