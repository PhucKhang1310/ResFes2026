const Alert = ({
    children,
    tone,
}: {
    children: string;
    tone: "error" | "success";
}) => (
    <div
        className={`mb-6 rounded-lg border px-4 py-3 text-sm ${tone === "error"
            ? "border-red-500/40 bg-red-950/50 text-red-100"
            : "border-emerald-500/40 bg-emerald-950/50 text-emerald-100"
            }`}
    >
        {children}
    </div>
);

export default Alert;