import { Activity, AlertCircle, Clock, User, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLogsStatsProps {
  total: number;
  errors: number;
  today: number;
  mostRecentUser: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: "indigo" | "rose" | "blue" | "slate";
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  description?: string;
}

const ACCENT = {
  indigo: {
    icon: "bg-indigo-100 text-indigo-600",
    value: "text-slate-900",
    bar: "bg-indigo-500",
    glow: "shadow-indigo-100",
  },
  rose: {
    icon: "bg-rose-100 text-rose-600",
    value: "text-rose-600",
    bar: "bg-rose-500",
    glow: "shadow-rose-100",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    value: "text-slate-900",
    bar: "bg-blue-500",
    glow: "shadow-blue-100",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    value: "text-slate-900",
    bar: "bg-slate-400",
    glow: "shadow-slate-100",
  },
};

function StatCard({ label, value, icon: Icon, accent, trend, trendLabel, description }: StatCardProps) {
  const a = ACCENT[accent];

  return (
    <div className={cn(
      "relative bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group",
      a.glow,
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-slate-50 -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-300" />

      {/* Top row */}
      <div className="relative flex items-start justify-between mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", a.icon)}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>

        {trend && trendLabel && (
          <span className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
            trend === "up" ? "bg-emerald-50 text-emerald-700" :
            trend === "down" ? "bg-rose-50 text-rose-700" :
            "bg-slate-50 text-slate-500",
          )}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> :
             trend === "down" ? <TrendingDown className="h-3 w-3" /> :
             <Minus className="h-3 w-3" />}
            {trendLabel}
          </span>
        )}
      </div>

      {/* Value */}
      <p className={cn("text-3xl font-bold leading-none mb-1.5 relative", a.value)}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {/* Label */}
      <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider relative">
        {label}
      </p>

      {description && (
        <p className="text-[11px] text-slate-400 mt-1 relative">{description}</p>
      )}

      {/* Bottom accent bar */}
      <div className={cn("absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full", a.bar)} />
    </div>
  );
}

export function ActivityLogsStats({ total, errors, today, mostRecentUser }: ActivityLogsStatsProps) {
  const errorRate = total > 0 ? ((errors / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Events"
        value={total}
        icon={Activity}
        accent="indigo"
        trend="neutral"
        trendLabel="All time"
      />
      <StatCard
        label="Errors"
        value={errors}
        icon={AlertCircle}
        accent="rose"
        trend={errors > 0 ? "down" : "neutral"}
        trendLabel={`${errorRate}% rate`}
        description={errors > 0 ? "Needs attention" : "All clear"}
      />
      <StatCard
        label="Today"
        value={today}
        icon={Clock}
        accent="blue"
        trend="up"
        trendLabel="Last 24h"
      />
      <StatCard
        label="Most Recent"
        value={mostRecentUser || "—"}
        icon={User}
        accent="slate"
        description="Last active user"
      />
    </div>
  );
}