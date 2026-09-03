import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { FaCalendarDays, FaXmark } from "react-icons/fa6";

const parseDate = (value: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (value: string) => {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date)
    : "Any date";
};

const ReportDateRangePicker = ({
  from,
  onChange,
  to,
}: {
  from: string;
  onChange: (range: { from: string; to: string }) => void;
  to: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected: DateRange | undefined =
    from || to ? { from: parseDate(from), to: parseDate(to) } : undefined;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (range: DateRange | undefined) => {
    onChange({
      from: formatDate(range?.from),
      to: formatDate(range?.to),
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-14">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="flex h-14 min-w-64 cursor-pointer items-center gap-3 rounded border border-amber-50/15 bg-black px-3 py-2 text-left transition hover:border-[#ff6a1f]"
        onClick={() => setIsOpen((current) => !current)}
      >
        <FaCalendarDays
          className="shrink-0 text-[#ff6a1f]"
          aria-hidden="true"
        />
        <span className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
          <span>
            <span className="block text-xs font-semibold text-amber-50/45">
              From
            </span>
            <span className="text-amber-50">{displayDate(from)}</span>
          </span>
          <span className="text-amber-50/30">to</span>
          <span>
            <span className="block text-xs font-semibold text-amber-50/45">
              To
            </span>
            <span className="text-amber-50">{displayDate(to)}</span>
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label="Select report date range"
          data-theme="dark"
          className="fixed inset-x-2 top-16 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto rounded border border-amber-50/15 bg-zinc-950 p-3 shadow-2xl sm:absolute sm:inset-x-auto sm:left-0 sm:top-[calc(100%+0.5rem)] sm:max-h-none sm:overflow-visible"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-50">
              Report dates
            </span>
            <button
              type="button"
              aria-label="Close calendar"
              title="Close calendar"
              className="inline-grid size-8 cursor-pointer place-items-center rounded text-amber-50/60 hover:bg-amber-50/10 hover:text-amber-50"
              onClick={() => setIsOpen(false)}
            >
              <FaXmark aria-hidden="true" />
            </button>
          </div>
          <DayPicker
            className="react-day-picker"
            mode="range"
            selected={selected}
            onSelect={handleSelect}
          />
          <button
            type="button"
            className="mt-2 w-full cursor-pointer rounded border border-amber-50/15 px-3 py-2 text-sm font-semibold text-amber-50 transition hover:border-amber-50/40"
            onClick={() => {
              onChange({ from: "", to: "" });
              setIsOpen(false);
            }}
          >
            Clear range
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ReportDateRangePicker;
