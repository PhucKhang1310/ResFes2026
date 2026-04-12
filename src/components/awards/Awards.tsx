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
      <div className={`mx-auto w-full max-w-6xl ${inView ? "fade-in" : "opacity-0"}`}>
        <div className="divider font-extrabold text-sm text-white">AWARDS</div>
        <div className="mx-auto mt-30 grid w-full max-w-5xl grid-cols-2 items-end gap-4 md:grid-cols-4 md:gap-5">
          <div className="flex flex-col items-center">
            <div className="mb-3 text-center text-sm font-semibold text sm:text-base">
              First Runner-up
            </div>
            <div className="flex h-45 w-full flex-col items-center justify-between rounded-t-2xl bg-zinc-900 px-3 py-5 ">
              <div className="text-center">
                <FaMedal className="mx-auto mb-2 text-3xl text" />
                <p className="text-4xl font-bold text">2</p>
              </div>
              <p className="text-center text-base font-bold">15 million VND*</p>
            </div>
          </div>

          <div className="order-first md:order-0 flex flex-col items-center">
            <div className="mb-3 text-center text-base font-bold sm:text-lg text-yellow-300">
              The Champion
            </div>
            <div className="flex h-65 w-full flex-col items-center justify-between rounded-t-2xl bg-zinc-900 bg-linear-to-b px-3 py-5 ">
              <div className="text-center">
                <FaTrophy className="mx-auto mb-3 text-4xl text-yellow-300" />
                <p className="text-5xl font-extrabold text-yellow-300">1</p>
              </div>
              <p className="text-center text-lg font-extrabold">
                20 million VND*
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-3 text-center text-sm font-semibold text-amber-500 sm:text-base">
              Second Runner-up
            </div>
            <div className="flex h-37.5 w-full flex-col items-center justify-between rounded-t-2xl bg-zinc-900 px-3 py-5 ">
              <div className="text-center">
                <FaMedal className="mx-auto mb-2 text-3xl text-amber-500" />
                <p className="text-4xl font-bold text-amber-500">3</p>
              </div>
              <p className="text-center text-base font-bold ">
                10 million VND*
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-3 text-center text-sm font-semibold text-purple-500 sm:text-base">
              Consolation Prize
            </div>
            <div className="flex h-30 w-full flex-col items-center justify-between rounded-t-2xl bg-zinc-900 px-3 py-4 ">
              <div className="text-center">
                <FaMedal className="mx-auto mb-1 text-2xl text-purple-500" />
                <p className="text-3xl font-bold text-purple-500">4</p>
              </div>
              <p className="text-center text-sm font-bold  sm:text-base">
                3 million VND*
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="italic text-sm font-thin opacity-35 justify-self-center mt-10">
        *Notice: Teams are subject to a specific amount of tax that adheres to
        the Vietnam's Law on Personal Income Tax if win one of the
        aforementioned prizes.
      </p>
    </section>
  );
};

export default Awards;
