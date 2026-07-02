import { usePageContent } from "../../hook/usePageContent";
import {
  getContentSectionStyle,
  sectionCssVars,
} from "../../config/pageCustomization";

const Regulations = () => {
  const { content } = usePageContent();
  const sectionStyle = getContentSectionStyle(content, "regulations");

  if (!content) {
    return null;
  }

  const { regulationsTitle, regulationsSubtitle, regulations } = content;

  return (
    <section
      id="regulations"
      style={sectionCssVars(sectionStyle)}
      className="bg-[var(--section-bg)] px-6 py-20 text-[var(--section-text)] lg:px-10 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-[var(--section-text)] lg:text-5xl">
            {regulationsTitle}
          </h2>
          <div className="mt-3 font-thin text-sm text-[var(--section-text)]/70 lg:text-base">
            <p className="divider before:bg-[var(--section-text)]/30 after:bg-[var(--section-text)]/30">{regulationsSubtitle}</p>
          </div>
        </div>

        <div className="join join-vertical w-full rounded-2xl bg-[var(--section-bg)] text-[var(--section-text)] shadow-xl">
          {regulations.map((section, index) => (
            <div
              key={section.id}
              className={`collapse collapse-arrow join-item border-b border-[var(--section-text)]/10 ${
                index === 0 ? "rounded-t-2xl" : ""
              } ${index === regulations.length - 1 ? "rounded-b-2xl" : ""}`}
            >
              <input
                type="radio"
                name="regulations-accordion"
                defaultChecked={index === 0}
              />
              <div className="collapse-title text-xl font-bold">
                {section.title}
              </div>
              <div className="collapse-content text-sm leading-7 text-[var(--section-text)]/80">
                <ul className="list-disc pl-5 space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={`${section.id}-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Regulations;
