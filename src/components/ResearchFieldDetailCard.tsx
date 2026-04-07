type ResearchFieldDetailCardProps = {
  title: string;
  leadLabel?: string;
  points: string[];
};

const ResearchFieldDetailCard = ({
  title,
  leadLabel,
  points,
}: ResearchFieldDetailCardProps) => {
  return (
    <div className="card w-[40vw] bg-black border-2 rounded-2xl">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
          {leadLabel ? <h2 className="-ml-5 font-bold">{leadLabel}</h2> : null}
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResearchFieldDetailCard;
