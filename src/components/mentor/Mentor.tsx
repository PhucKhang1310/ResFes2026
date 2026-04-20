const mentors = [
  {
    name: "Dr. Lan Nguyen",
    role: "Research Lead, Information Technology",
    image: "https://picsum.photos/seed/resfes-mentor-1/800/1000",
    description:
      "Guides student teams through AI, software engineering, and data-driven research with a focus on practical experimentation.",
  },
  {
    name: "Prof. Minh Tran",
    role: "Innovation Mentor, Business Administration",
    image: "https://picsum.photos/seed/resfes-mentor-2/800/1000",
    description:
      "Supports market analysis, startup validation, and strategy-focused research grounded in evidence and clear business framing.",
  },
  {
    name: "Dr. An Pham",
    role: "Creative Mentor, Digital Art & Design",
    image: "https://picsum.photos/seed/resfes-mentor-3/800/1000",
    description:
      "Helps students turn concepts into compelling visual narratives using design thinking, prototyping, and user-centered critique.",
  },
  {
    name: "Ms. Thu Le",
    role: "Communication Mentor",
    image: "https://picsum.photos/seed/resfes-mentor-4/800/1000",
    description:
      "Supports multimedia storytelling, media ethics, and presentation clarity for projects in communication technology.",
  },
  {
    name: "Dr. Quang Ho",
    role: "Language Research Mentor",
    image: "https://picsum.photos/seed/resfes-mentor-5/800/1000",
    description:
      "Advises linguistics teams on corpus research, translation studies, and language-focused inquiry with academic precision.",
  },
  {
    name: "Assoc. Prof. Huyen Vo",
    role: "Cross-Disciplinary Mentor",
    image: "https://picsum.photos/seed/resfes-mentor-6/800/1000",
    description:
      "Brings together interdisciplinary perspectives so teams can refine ideas, structure their research, and present confidently.",
  },
];

const splitName = (name: string) => {
  const parts = name.split(" ");
  const last = parts.pop() ?? "";
  const first = parts.join(" ");

  return { first, last };
};

const Mentor = () => {
  return (
    <main className="min-h-screen bg-amber-50 px-6 py-20 text-black lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-black/60">
            Mentors
          </p>
          <h1 className="text-4xl font-black leading-tight lg:text-6xl">
            Meet the mentors guiding ResFes 2026
          </h1>
          <p className="mt-6 text-base leading-7 text-black/70 lg:text-lg">
            A six-person mentoring team supporting research, creativity, and
            presentation quality across every field in the competition.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <li key={mentor.name} className="flex">
              <article className="group relative w-full overflow-hidden rounded-2xl bg-black shadow-xl transition-transform duration-300 hover:-translate-y-1">
                <picture>
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="h-full min-h-104 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </picture>

                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white lg:p-6">
                  <h2 className="text-3xl font-black leading-tight">
                    {splitName(mentor.name).first}{" "}
                    <strong>{splitName(mentor.name).last}</strong>
                  </h2>
                  <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/85">
                    {mentor.role}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-white/80">
                    {mentor.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="btn btn-primary border-none bg-[#ff6a1f] text-white hover:bg-[#e85f1b]"
          >
            Back to home
          </a>
        </div>
      </section>
    </main>
  );
};

export default Mentor;
