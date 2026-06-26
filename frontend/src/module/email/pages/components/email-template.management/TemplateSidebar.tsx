import {
  Mail,
  Send,
  UserCheck,
  CreditCard,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    label: "All Templates",
    icon: LayoutGrid,
    value: "all",
    description: "View all templates",
    accent: "indigo",
  },
  {
    label: "Application Status",
    icon: Send,
    value: "application_status",
    description: "Job application updates",
    accent: "violet",
  },
  {
    label: "Interview Related",
    icon: UserCheck,
    value: "interview_related",
    description: "Schedules & reminders",
    accent: "blue",
  },
  {
    label: "Account Related",
    icon: Mail,
    value: "account_related",
    description: "Signup, reset & alerts",
    accent: "sky",
  },
  {
    label: "Subscription Related",
    icon: CreditCard,
    value: "subscription_related",
    description: "Billing & plan changes",
    accent: "teal",
  },
];

const ACCENT_MAP: Record<
  string,
  {
    active: string;
    icon: string;
    dot: string;
    hover: string;
    ring: string;
  }
> = {
  indigo: {
    active: "bg-indigo-600 text-white shadow-indigo-500/30",
    icon: "text-indigo-300",
    dot: "bg-indigo-300",
    hover: "hover:bg-indigo-50/70 hover:text-indigo-700",
    ring: "ring-indigo-200",
  },
  violet: {
    active: "bg-violet-600 text-white shadow-violet-500/30",
    icon: "text-violet-300",
    dot: "bg-violet-400",
    hover: "hover:bg-violet-50/70 hover:text-violet-700",
    ring: "ring-violet-200",
  },
  blue: {
    active: "bg-blue-600 text-white shadow-blue-500/30",
    icon: "text-blue-300",
    dot: "bg-blue-400",
    hover: "hover:bg-blue-50/70 hover:text-blue-700",
    ring: "ring-blue-200",
  },
  sky: {
    active: "bg-sky-600 text-white shadow-sky-500/30",
    icon: "text-sky-300",
    dot: "bg-sky-400",
    hover: "hover:bg-sky-50/70 hover:text-sky-700",
    ring: "ring-sky-200",
  },
  teal: {
    active: "bg-teal-600 text-white shadow-teal-500/30",
    icon: "text-teal-300",
    dot: "bg-teal-400",
    hover: "hover:bg-teal-50/70 hover:text-teal-700",
    ring: "ring-teal-200",
  },
};

interface TemplateSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
}

export function TemplateSidebar({
  activeCategory,
  onCategoryChange,
  counts = {},
}: TemplateSidebarProps) {
  return (
    <Card className="border-slate-200/70 shadow-sm sticky top-20 overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/30">
            <LayoutGrid className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
              Filter by
            </p>
            <h3 className="text-sm font-bold text-slate-800 leading-none">
              Categories
            </h3>
          </div>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="space-y-1">
          {CATEGORIES.map((cat, index) => {
            const isActive = activeCategory === cat.value;
            const accent = ACCENT_MAP[cat.accent];
            const count = counts[cat.value];

            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                style={{ animationDelay: `${index * 40}ms` }}
                className={cn(
                  "w-full group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 outline-none",
                  isActive
                    ? cn(
                        "shadow-lg",
                        accent.active,
                      )
                    : cn(
                        "text-slate-600",
                        accent.hover,
                      ),
                  "focus-visible:ring-2 focus-visible:ring-offset-1",
                  !isActive && accent.ring,
                )}
              >
                {/* Icon container */}
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                    isActive
                      ? "bg-white/15"
                      : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm",
                  )}
                >
                  <cat.icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive
                        ? accent.icon
                        : "text-slate-500 group-hover:text-current",
                    )}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight truncate",
                      isActive ? "text-white" : "text-slate-700",
                    )}
                  >
                    {cat.label}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] mt-0.5 leading-tight truncate transition-colors",
                      isActive ? "text-white/70" : "text-slate-400",
                    )}
                  >
                    {cat.description}
                  </p>
                </div>

                {/* Count badge or chevron */}
                {count !== undefined ? (
                  <span
                    className={cn(
                      "shrink-0 min-w-[22px] h-5.5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center tabular-nums",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {count}
                  </span>
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-all duration-200",
                      isActive
                        ? "text-white/60 translate-x-0.5"
                        : "text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5",
                    )}
                  />
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/40" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="mt-4 mx-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Select a category to filter templates. Use{" "}
            <span className="font-semibold text-slate-500">All Templates</span>{" "}
            to see everything.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}