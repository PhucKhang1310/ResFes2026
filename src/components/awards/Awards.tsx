import { FaMedal, FaTrophy } from "react-icons/fa6";
import { useFadeIn } from "../../hook/useFadeIn";
const Awards = () => {
  const { inView, ref } = useFadeIn(0.15, 80);

  return (
    <section
      id="awards"
      ref={ref}
      className={`bg-black px-6 py-20 lg:px-10 pt-30 scroll-mt-24`}
    >
      <div
        className={`mx-auto w-full max-w-6xl ${
          inView ? "fade-in" : "opacity-0"
        }`}
      >
        <div className="divider font-extrabold text-sm text-white! before:bg-amber-50/15! after:bg-amber-50/15!">
          AWARDS
        </div>
        <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div className="flex flex-col items-center">
            <div className="mb-3 text-center text-sm font-semibold text-white sm:text-base">
              For sub-committees with 4-5 topics
            </div>
            <div className="flex h-56 w-full flex-col items-center justify-between rounded-2xl bg-zinc-900 text-white px-3 py-5">
              <div className="text-center">
                <FaMedal className="mx-auto mb-2 text-3xl text-white" />
                <p className="text-3xl font-bold text-white">1 Prize</p>
              </div>
              <p className="text-center text-base font-bold">
                Khoi nguon Tri thuc: 6,000,000 VND
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-3 text-center text-sm font-semibold text-yellow-300 sm:text-base">
              For sub-committees with 6+ topics
            </div>
            <div className="flex h-56 w-full flex-col items-center justify-between rounded-2xl bg-zinc-900 text-white px-3 py-5">
              <div className="text-center">
                <FaTrophy className="mx-auto mb-2 text-3xl text-yellow-300" />
                <p className="text-3xl font-bold text-yellow-300">Top 3</p>
              </div>
              <p className="text-center text-sm font-bold text-white sm:text-base">
                1st: 10,000,000 VND | 2nd: 6,000,000 VND | 3rd: 4,000,000 VND
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-amber-200/25 bg-zinc-900/70 p-5 text-sm text-white/90">
          <p className="font-semibold text-amber-200">
            Special note for Information Technology sub-committee:
          </p>
          <p className="mt-2">
            If there are at least 10 final presentations, the award structure is
            expanded with 02 second prizes and 02 third prizes.
          </p>
        </div>
      </div>
      <p className="italic text-sm font-thin text-white/35 justify-self-center mt-10 max-w-5xl text-center mx-auto">
        Important: Teams that submit papers on time must present at the Final
        Round and attend the full program, especially the closing ceremony.
        Absence may affect award structure and can lead to cancellation of the
        team's result.
      </p>
    </section>
  );
};

export default Awards;
