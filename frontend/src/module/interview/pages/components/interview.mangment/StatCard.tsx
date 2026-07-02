export default function StatCard({
  label,
  value,
  sub,
  accent = "blue",
}: {
  label: string;
  value: string;
  sub: string;
  accent?: "blue" | "violet" | "emerald" | "amber" | "rose";
}) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className={`rounded-lg border p-4 ${accentClasses[accent]}`}>
      <div className="text-xs font-bold uppercase tracking-wider opacity-75">
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs mt-2 opacity-75">{sub}</div>
    </div>
  );
}