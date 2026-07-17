import { Ban, Clock3, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";

interface RecruiterStatsCardsProps {
  recruiters: RecruiterProfile[];
  total: number;
  activeFilter: string;
  onFilterClick: (value: "all" | "pending" | "verified" | "blocked") => void;
  overrides?: { verified?: number; pending?: number; blocked?: number };
}

export function RecruiterStatsCards({
  recruiters,
  total,
  activeFilter,
  onFilterClick,
  overrides,
}: RecruiterStatsCardsProps) {
  const verified =
    overrides?.verified ??
    recruiters.filter((r) => r.verificationStatus?.toLowerCase() === "verified").length;
  const pending =
    overrides?.pending ??
    recruiters.filter((r) => r.verificationStatus?.toLowerCase() === "pending").length;
  const blocked =
    overrides?.blocked ?? recruiters.filter((r) => (r.isActive ?? true) === false).length;

  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;

  const cards = [
    {
      label: "Recruiters",
      value: total,
      value_key: "all" as const,
      sub: "All accounts",
      icon: Users,
      accent: "text-slate-900",
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      label: "Verified",
      value: verified,
      value_key: "verified" as const,
      sub: total > 0 ? `${verifiedPct}% of total` : "No data yet",
      icon: ShieldCheck,
      accent: "text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pending",
      value: pending,
      value_key: "pending" as const,
      sub: "Needs review",
      icon: Clock3,
      accent: "text-amber-700",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      label: "Blocked",
      value: blocked,
      value_key: "blocked" as const,
      sub: "Restricted",
      icon: Ban,
      accent: "text-rose-700",
      iconBg: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.value_key}
            onClick={() => onFilterClick(card.value_key)}
            className={cn(
              "rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
              activeFilter === card.value_key
                ? "border-indigo-300 ring-1 ring-indigo-200"
                : "border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </div>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  card.iconBg,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className={cn("mt-1 text-2xl font-semibold", card.accent)}>
              {card.value}
            </div>

            <div className="mt-0.5 text-[11px] text-slate-400">{card.sub}</div>
          </button>
        );
      })}
    </div>
  );
}