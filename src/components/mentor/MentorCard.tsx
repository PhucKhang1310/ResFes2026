import { useState } from "react";
import { FaGlobe } from "react-icons/fa6";
import { SiGooglescholar, SiOrcid, SiResearchgate } from "react-icons/si";

interface MentorLinks {
  website?: string;
  orcid?: string;
  researchgate?: string;
  googleScholar?: string;
}

interface MentorCardProps {
  name: string;
  role: string;
  image: string;
  description: string;
  links?: MentorLinks;
}

const splitName = (name: string) => {
  const parts = name.split(" ");
  const last = parts.pop() ?? "";
  const first = parts.join(" ");

  return { first, last };
};

const MentorCard = ({
  name,
  role,
  image,
  description,
  links,
}: MentorCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 180;
  const hasAnyLink =
    !!links?.website ||
    !!links?.orcid ||
    !!links?.researchgate ||
    !!links?.googleScholar;
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const visibleDescription =
    expanded || !isLongDescription
      ? description
      : `${description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`;

  return (
    <li className="flex">
      <article className="group relative h-168 w-full overflow-hidden rounded-2xl bg-black shadow-xl transition-transform duration-300 hover:-translate-y-1">
        <picture>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </picture>

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent"
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 text-white lg:p-6">
          <div className="avatar mb-3 self-start">
            <div className="w-16 rounded-full ring ring-white/70 ring-offset-2 ring-offset-black/30">
              <img src={image} alt={`${name} avatar`} loading="lazy" />
            </div>
          </div>
          <div className="min-h-24">
            <h2 className="text-3xl font-black leading-tight">
              {splitName(name).first} <strong>{splitName(name).last}</strong>
            </h2>
            <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/85">
              {role}
            </h3>
          </div>
          <div className="min-h-30">
            <p
              className={`text-sm leading-6 text-white/80 ${
                expanded ? "max-h-40 overflow-y-auto pr-1" : ""
              }`}
            >
              {visibleDescription}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setExpanded((previous) => !previous)}
                className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 underline-offset-2 hover:text-white hover:underline"
              >
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </div>
          {hasAnyLink && (
            <div className="mt-4 flex items-center gap-3 text-white">
              {links?.website && (
                <a
                  href={links.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${name} website`}
                  className="text-white/85 transition-colors hover:text-white"
                >
                  <FaGlobe className="text-lg" />
                </a>
              )}
              {links?.orcid && (
                <a
                  href={links.orcid}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${name} ORCID`}
                  className="text-white/85 transition-colors hover:text-white"
                >
                  <SiOrcid className="text-lg" />
                </a>
              )}
              {links?.researchgate && (
                <a
                  href={links.researchgate}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${name} ResearchGate`}
                  className="text-white/85 transition-colors hover:text-white"
                >
                  <SiResearchgate className="text-lg" />
                </a>
              )}
              {links?.googleScholar && (
                <a
                  href={links.googleScholar}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${name} Google Scholar`}
                  className="text-white/85 transition-colors hover:text-white"
                >
                  <SiGooglescholar className="text-lg" />
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
};

export default MentorCard;
