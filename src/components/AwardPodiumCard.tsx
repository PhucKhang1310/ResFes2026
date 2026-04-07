import type { ReactNode } from "react";

type AwardPodiumCardProps = {
  containerClassName?: string;
  title: string;
  titleClassName?: string;
  bodyClassName?: string;
  icon: ReactNode;
  rank: string;
  rankClassName?: string;
  reward: string;
  rewardClassName?: string;
};

const AwardPodiumCard = ({
  containerClassName = "",
  title,
  titleClassName = "",
  bodyClassName = "",
  icon,
  rank,
  rankClassName = "",
  reward,
  rewardClassName = "",
}: AwardPodiumCardProps) => {
  return (
    <div className={`flex flex-col items-center ${containerClassName}`.trim()}>
      <div className={`mb-3 text-center ${titleClassName}`.trim()}>{title}</div>
      <div
        className={`flex w-full flex-col items-center justify-between rounded-t-2xl bg-zinc-900 px-3 py-5 ${bodyClassName}`.trim()}
      >
        <div className="text-center">
          {icon}
          <p className={rankClassName}>{rank}</p>
        </div>
        <p className={rewardClassName}>{reward}</p>
      </div>
    </div>
  );
};

export default AwardPodiumCard;
