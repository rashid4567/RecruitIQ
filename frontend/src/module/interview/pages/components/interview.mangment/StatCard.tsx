import type { ComponentType } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Accent = "blue" | "violet" | "emerald" | "amber" | "rose";

const ACCENT_STYLES: Record<
  Accent,
  { border: string; iconBg: string; iconText: string; glow: string }
> = {
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    glow: "group-hover:shadow-blue-100",
  },
  violet: {
    border: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    glow: "group-hover:shadow-violet-100",
  },
  emerald: {
    border: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    glow: "group-hover:shadow-emerald-100",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    glow: "group-hover:shadow-amber-100",
  },
  rose: {
    border: "border-l-rose-500",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    glow: "group-hover:shadow-rose-100",
  },
};

export default function StatCard({
  label,
  value,
  sub,
  accent = "blue",
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: Accent;
  icon?: ComponentType<{ size?: number; className?: string }>;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
}) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 border-l-4 ${styles.border} bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${styles.glow}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        {Icon && (
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.iconBg} ${styles.iconText}`}
          >
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold ${
              trend.direction === "up"
                ? "text-emerald-600"
                : trend.direction === "down"
                  ? "text-rose-600"
                  : "text-slate-400"
            }`}
          >
            {trend.direction === "up" && <ArrowUpRight size={12} />}
            {trend.direction === "down" && <ArrowDownRight size={12} />}
            {trend.value}
          </span>
        )}
      </div>

      <p className="mt-1 truncate text-xs text-slate-400">{sub}</p>
    </div>
  );
}