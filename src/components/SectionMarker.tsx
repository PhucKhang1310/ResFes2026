type SectionMarkerProps = {
  label: string;
  className?: string;
  iconWidth?: number;
  fillColor?: string;
};

const SectionMarker = ({
  label,
  className = "",
  iconWidth = 10,
  fillColor = "#ffffff",
}: SectionMarkerProps) => {
  return (
    <span className={`font-extrabold flex gap-3 ${className}`.trim()}>
      <svg
        viewBox="0 0 292.828 292.828"
        xmlns="http://www.w3.org/2000/svg"
        width={iconWidth}
      >
        <polygon
          points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
          fill={fillColor}
        />
      </svg>
      {label}
    </span>
  );
};

export default SectionMarker;
