export type AuditLogFilterValue = {
  actor: string;
  action: string;
  targetType: string;
  dateFrom: string;
  dateTo: string;
};

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";

const AuditLogFilters = ({
  value,
  onChange,
}: {
  value: AuditLogFilterValue;
  onChange: (value: AuditLogFilterValue) => void;
}) => {
  const update = (field: keyof AuditLogFilterValue, nextValue: string) =>
    onChange({ ...value, [field]: nextValue });

  return (
    <div className="mb-6 grid gap-3 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 md:grid-cols-5">
      <input className={inputClass} placeholder="Actor" value={value.actor} onChange={(event) => update("actor", event.target.value)} />
      <input className={inputClass} placeholder="Action" value={value.action} onChange={(event) => update("action", event.target.value)} />
      <input className={inputClass} placeholder="Target type" value={value.targetType} onChange={(event) => update("targetType", event.target.value)} />
      <input className={inputClass} type="date" value={value.dateFrom} onChange={(event) => update("dateFrom", event.target.value)} />
      <input className={inputClass} type="date" value={value.dateTo} onChange={(event) => update("dateTo", event.target.value)} />
    </div>
  );
};

export default AuditLogFilters;
