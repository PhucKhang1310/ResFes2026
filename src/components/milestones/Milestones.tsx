type Milestone = {
  id: number;
  date: string;
  title: string;
  detail?: string;
};

const milestones: Milestone[] = [
  {
    id: 1,
    date: "March 16 - 5:00 PM, April 16",
    title: "Registration and Proposal submission",
    detail: "START",
  },
  {
    id: 2,
    date: "April 16",
    title: "Preliminary round's Workshops",
  },
  {
    id: 3,
    date: "April 23",
    title: "Announcement on Preliminary Round Candidates",
  },
  {
    id: 4,
    date: "May 09 & 10",
    title: "Preliminary Round",
  },
  {
    id: 5,
    date: "May 19",
    title: "Preliminary Round result announcement",
  },
  {
    id: 6,
    date: "5:00 PM, July 19",
    title: "Full paper submission",
  },
  {
    id: 7,
    date: "July 22",
    title: "Announcement on The Finale Candidates",
  },
  {
    id: 8,
    date: "August 15",
    title: "The Finale",
  },
];

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const Milestones = () => {
  return (
    <>
      <section
        id="milestones"
        className="bg-black px-6 py-16 text-white lg:px-10 scroll-mt-24"
      >
        <span className="font-extrabold text-sm text-white flex gap-3 justify-center mb-10">
          <svg
            viewBox="0 0 292.828 292.828"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
          >
            <polygon
              points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
              fill="#ffffff"
            />
          </svg>
          MILESTONES
        </span>
        <div className="mx-auto max-w-5xl px-2 py-4 sm:px-4">
          <ul className="timeline timeline-snap-icon timeline-vertical w-full">
            {milestones.map((item, index) => (
              <li key={item.id}>
                {index !== 0 && <hr className="bg-white/40" />}

                {index % 2 === 0 ? (
                  <div className="timeline-start timeline-box border-white/25 bg-black text-right">
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
