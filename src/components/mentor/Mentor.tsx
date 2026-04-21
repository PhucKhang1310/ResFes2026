import { useMemo, useState } from "react";
import MentorCard from "./MentorCard";
import { mentors } from "./mentorData";

const Mentor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");

  const departments = useMemo(() => {
    const uniqueDepartments = new Set(
      mentors.map((mentor) => mentor.role.split("|")[1]?.trim() ?? "Other")
    );

    return ["All", ...Array.from(uniqueDepartments).sort()];
  }, []);

  const filteredMentors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const department = mentor.role.split("|")[1]?.trim() ?? "Other";
      const matchesDepartment =
        activeDepartment === "All" || department === activeDepartment;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        mentor.name.toLowerCase().includes(normalizedSearch) ||
        mentor.role.toLowerCase().includes(normalizedSearch);

      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartment, searchTerm]);

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
            A multidisciplinary mentoring team of {mentors.length} experts
            supporting research, creativity, and presentation quality across
            every field in the competition.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <label className="input input-bordered mx-auto flex w-full max-w-7xl items-center gap-2 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5.5 5.5 0 1 1 1.06-1.06l3.474 3.474a.75.75 0 1 1-1.06 1.06l-3.474-3.474ZM10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Search mentors by name or role"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className="filter flex flex-wrap gap-2 max-w-7xl">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => setActiveDepartment(department)}
                className={`btn btn-sm rounded-full ${
                  activeDepartment === department
                    ? "btn-neutral text-white"
                    : "btn-outline"
                }`}
              >
                {department}
              </button>
            ))}
          </div>

          <p className="text-sm text-black/70">
            Showing {filteredMentors.length} of {mentors.length} mentors
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor, index) => (
            <MentorCard
              key={`${mentor.name}-${index}`}
              name={mentor.name}
              role={mentor.role}
              image={mentor.image}
              description={mentor.description}
              links={mentor.links}
            />
          ))}
        </ul>

        {filteredMentors.length === 0 && (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 text-center text-black/70">
            No mentors matched your search or filter.
          </div>
        )}

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
