import workshopImage from "../../assets/resfes_tour.jpg";

const Workshops = () => {
  return (
    <section id="workshops" className="scroll-mt-24 px-6 py-20 lg:px-10 ">
      <div
        className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center overflow-hidden rounded-4xl border border-white/10 bg-black text-white shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.8)), url(${workshopImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center lg:px-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-orange-400/90">
            Workshops
          </p>
          <h2 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Scientific Research Guidance Workshops
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Registration link: available in official announcement.
          </p>

          <div className="mt-8 w-full rounded-2xl border border-white/20 bg-black/45 p-5 text-left text-sm leading-7 text-white/90">
            <p className="font-bold text-orange-300">
              1) Research Methodology Guidance - Engineering
            </p>
            <p>Speaker: Dr. Ta Hoang Thang</p>
            <p>Time: 8:30 - 10:30, Sunday, 01.03.2026</p>
            <p>Venue: Hall Academic, FPTU HCMC</p>

            <p className="mt-4 font-bold text-orange-300">
              2) Research Methodology Guidance - Economics and Social Sciences
            </p>
            <p>Speaker: Dr. Le Ha Van</p>
            <p>Time: 8:30 - 10:30, Sunday, 01.03.2026</p>
            <p>Venue: Hall Business, FPTU HCMC</p>

            <p className="mt-4 font-bold text-orange-300">
              3) Reporting with LaTeX/Overleaf
            </p>
            <p>Speaker: PhD Candidate Pham Minh Tri</p>
            <p>Time: 10:30 - 12:00, Sunday, 01.03.2026</p>
            <p>Venue: Hall Academic, FPTU HCMC</p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,153,0,0.15),transparent_40%),radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>
    </section>
  );
};

export default Workshops;
