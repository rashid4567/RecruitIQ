import { Loader2, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TabId } from "../../hooks/jobPost-Hooks/useAllJobpost";

const TABS: { id: TabId; label: string; color?: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "blocked", label: "Blocked" },
  { id: "draft", label: "Draft" },
  { id: "expired", label: "Expired" },
];

interface JobPostFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  total: number;
  loading: boolean;
  onRefresh: () => void;
}

export function JobPostFilters({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  total,
  loading,
  onRefresh,
}: JobPostFiltersProps) {
  return (
    <div className="mb-6 space-y-3">
      {/* Tab bar + search */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + refresh */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search title, department, skills…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-9 h-10 rounded-xl bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="gap-1.5 h-10 rounded-xl text-slate-600 border-slate-200"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-slate-500">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
            Loading…
          </span>
        ) : (
          <>
            <span className="font-semibold text-slate-900">{total}</span> job
            {total !== 1 ? "s" : ""} found
          </>
        )}
      </p>
    </div>
  );
}