import workshopImage from "../../assets/resfes_tour.jpg";

const Workshops = () => {
  return (
    <section id="workshops" className="scroll-mt-24 px-6 py-20 lg:px-10">
      <div
        className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center overflow-hidden rounded-[2rem] border border-white/10 bg-black text-white shadow-2xl"
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
            Elevate Your Research Skills!
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Our workshops are designed to equip students with the essential
            tools to build stronger research papers, sharpen methodology, and
            present work that meets international standards.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="btn border-0 bg-orange-500 px-8 text-white hover:bg-orange-500/90">
              Join the Workshop
            </button>
            <button className="btn btn-outline border-white/50 bg-transparent px-8 text-white hover:bg-white hover:text-black">
              View Agenda
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,153,0,0.15),transparent_40%),radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>
    </section>
  );
};

export default Workshops;
