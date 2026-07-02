import type { ReactNode } from "react";

export default function StatTile({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "good" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
        {icon}
        {label}
      </span>
      <span
        className={`text-sm font-bold ${tone === "good" ? "text-emerald-600" : "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}