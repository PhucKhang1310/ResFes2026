import { FaMedal, FaTrophy } from "react-icons/fa6";
import AwardPodiumCard from "../components/AwardPodiumCard";

const Awards = () => {
  return (
    <section
      id="awards"
      className="bg-black px-6 py-20 lg:px-10 pt-30 scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="divider font-extrabold text-sm text-white">AWARDS</div>
        <div className="mx-auto mt-30 grid w-full max-w-5xl grid-cols-2 items-end gap-4 md:grid-cols-4 md:gap-5">
          <AwardPodiumCard
            title="First Runner-up"
            titleClassName="text-sm font-semibold text sm:text-base"
            bodyClassName="h-45"
            icon={<FaMedal className="mx-auto mb-2 text-3xl text" />}
            rank="2"
            rankClassName="text-4xl font-bold text"
            reward="15 million VND*"
            rewardClassName="text-center text-base font-bold"
          />

          <AwardPodiumCard
            containerClassName="order-first md:order-0"
            title="The Champion"
            titleClassName="text-base font-bold sm:text-lg text-yellow-300"
            bodyClassName="h-65 bg-linear-to-b"
            icon={
              <FaTrophy className="mx-auto mb-3 text-4xl text-yellow-300" />
            }
            rank="1"
            rankClassName="text-5xl font-extrabold text-yellow-300"
            reward="20 million VND*"
            rewardClassName="text-center text-lg font-extrabold"
          />

          <AwardPodiumCard
            title="Second Runner-up"
            titleClassName="text-sm font-semibold text-amber-500 sm:text-base"
            bodyClassName="h-37.5"
            icon={<FaMedal className="mx-auto mb-2 text-3xl text-amber-500" />}
            rank="3"
            rankClassName="text-4xl font-bold text-amber-500"
            reward="10 million VND*"
            rewardClassName="text-center text-base font-bold"
          />

          <AwardPodiumCard
            title="Consolation Prize"
            titleClassName="text-sm font-semibold text-purple-500 sm:text-base"
            bodyClassName="h-30 py-4"
            icon={<FaMedal className="mx-auto mb-1 text-2xl text-purple-500" />}
            rank="4"
            rankClassName="text-3xl font-bold text-purple-500"
            reward="3 million VND*"
            rewardClassName="text-center text-sm font-bold sm:text-base"
          />
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
