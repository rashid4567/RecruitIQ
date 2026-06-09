import { Search, X, RotateCw, CheckCircle2, AlertTriangle, FlaskConical, Mail, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface EmailLogsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

/* ─── Chip ──────────────────────────────────────────────────── */

function ActiveChip({
  label,
  onRemove,
  color = "indigo",
}: {
  label: string;
  onRemove: () => void;
  color?: "indigo" | "rose" | "emerald" | "amber";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rose:   "bg-rose-50   text-rose-700   border-rose-200",
    emerald:"bg-emerald-50 text-emerald-700 border-emerald-200",
    amber:  "bg-amber-50  text-amber-700  border-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-[11px] font-semibold border",
        colors[color],
      )}
    >
      {label}
      <button
        onClick={onRemove}
        className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
      >
        <X className="h-2.5 w-2.5" strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */

export function EmailLogsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onClearFilters,
}: EmailLogsFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" || statusFilter !== "ALL" || typeFilter !== "ALL";

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">

        {/* ── Main filter row ── */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search recipient or subject…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 pl-10 pr-9 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400 rounded-xl text-sm placeholder:text-slate-400 transition-all"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Filter label */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
            </div>

            {/* Status select */}
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger
                className={cn(
                  "h-10 w-40 rounded-xl border text-sm font-medium transition-all",
                  statusFilter !== "ALL"
                    ? statusFilter === "SENT"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "border-rose-300 bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                )}
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    All Statuses
                  </span>
                </SelectItem>
                <SelectItem value="SENT">
                  <span className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sent
                  </span>
                </SelectItem>
                <SelectItem value="FAILED">
                  <span className="flex items-center gap-2 text-sm text-rose-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Failed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Type select */}
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger
                className={cn(
                  "h-10 w-36 rounded-xl border text-sm font-medium transition-all",
                  typeFilter !== "ALL"
                    ? typeFilter === "TEST"
                      ? "border-amber-300 bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      : "border-indigo-300 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                )}
              >
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    All Types
                  </span>
                </SelectItem>
                <SelectItem value="TEST">
                  <span className="flex items-center gap-2 text-sm text-amber-700">
                    <FlaskConical className="h-3.5 w-3.5" />
                    Test
                  </span>
                </SelectItem>
                <SelectItem value="REAL">
                  <span className="flex items-center gap-2 text-sm text-indigo-700">
                    <Mail className="h-3.5 w-3.5" />
                    Production
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Clear all */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="h-10 px-3.5 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all duration-150"
              >
                <RotateCw className="h-3.5 w-3.5" strokeWidth={2} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-0.5">
              Active:
            </span>

            {search && (
              <ActiveChip
                label={`"${search}"`}
                onRemove={() => onSearchChange("")}
                color="indigo"
              />
            )}
            {statusFilter === "SENT" && (
              <ActiveChip
                label="Sent"
                onRemove={() => onStatusFilterChange("ALL")}
                color="emerald"
              />
            )}
            {statusFilter === "FAILED" && (
              <ActiveChip
                label="Failed"
                onRemove={() => onStatusFilterChange("ALL")}
                color="rose"
              />
            )}
            {typeFilter === "TEST" && (
              <ActiveChip
                label="Test emails"
                onRemove={() => onTypeFilterChange("ALL")}
                color="amber"
              />
            )}
            {typeFilter === "REAL" && (
              <ActiveChip
                label="Production"
                onRemove={() => onTypeFilterChange("ALL")}
                color="indigo"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}