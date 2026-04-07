type Milestone = {
  date: string;
  title: string;
  detail?: string;
};

import SectionMarker from "../components/SectionMarker";

const milestones: Milestone[] = [
  {
    date: "March 16 - 5:00 PM, April 16",
    title: "Registration and Proposal submission",
    detail: "START",
  },
  {
    date: "April 6",
    title: "Preliminary round's Workshops",
  },
  {
    date: "April 23",
    title: "Announcement on Preliminary Round Candidates",
  },
  {
    date: "May 09 & 10",
    title: "Preliminary Round",
  },
  {
    date: "May 19",
    title: "Preliminary Round result announcement",
  },
  {
    date: "5:00 PM, July 19",
    title: "Full paper submission",
  },
  {
    date: "July 22",
    title: "Announcement on The Finale Candidates",
  },
  {
    date: "August 15",
    title: "The Finale",
  },
];

const CheckIcon = () => (
  <span className="block h-3.5 w-3.5 rounded-full bg-white" />
);

const Milestones = () => {
  return (
    <>
      <section
        id="milestones"
        className="bg-black px-6 py-16 text-white lg:px-10 scroll-mt-24"
      >
        <SectionMarker
          label="MILESTONES"
          className="text-sm text-white justify-center mb-10"
        />
        <div className="mx-auto max-w-5xl px-2 py-4 sm:px-4">
          <ul className="timeline timeline-snap-icon timeline-vertical w-full">
            {milestones.map((item, index) => (
              <li key={`${item.date}-${index}`}>
                {index !== 0 && <hr className="bg-white/40" />}

                {index % 2 === 0 ? (
                  <div
                    className={`timeline-start timeline-box border-white/25 bg-black text-right ${
                      index === 0 ? "milestone-box-blink" : ""
                    }`}
                  >
                    {item.detail ? (
                      <span className="badge badge-outline badge-xs mb-2 border-white text-white">
                        {item.detail}
                      </span>
                    ) : null}
                    <time className="block text-xs font-extrabold uppercase tracking-wide text-white">
                      {item.date}
                    </time>
                    <div className="mt-1 text-sm font-semibold text-white/85">
                      {item.title}
                    </div>
                  </div>
                ) : null}

                <div className="timeline-middle">
                  <CheckIcon />
                </div>

                {index % 2 !== 0 ? (
                  <div className="timeline-end timeline-box border-white/25 bg-black">
                    {item.detail ? (
                      <span className="badge badge-outline badge-xs mb-2 border-white text-white">
                        {item.detail}
                      </span>
                    ) : null}
                    <time className="block text-xs font-extrabold uppercase tracking-wide text-white">
                      {item.date}
                    </time>
                    <div className="mt-1 text-sm font-semibold text-white/85">
                      {item.title}
                    </div>
                  </div>
                ) : null}

                {index !== milestones.length - 1 && (
                  <hr className="bg-white/40" />
                )}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm italic font-thin opacity-40">
            Acknowledged. All future time-related milestones and event schedules
            will be provided using the GMT+7 (Indochina Time) offset.
          </p>
        </div>
      </section>
    </>
  );
};

export default Milestones;
