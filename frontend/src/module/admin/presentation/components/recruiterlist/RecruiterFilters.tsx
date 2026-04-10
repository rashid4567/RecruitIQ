import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "pending" | "verified" | "blocked";

interface RecruiterFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  tab: FilterTab;
  setTab: (tab: FilterTab) => void;
}

export function RecruiterFilters({
  search,
  setSearch,
  tab,
  setTab,
}: RecruiterFiltersProps) {
  const tabs: { label: string; value: FilterTab; color: string }[] = [
    { label: "All", value: "all", color: "slate" },
    { label: "Pending", value: "pending", color: "amber" },
    { label: "Verified", value: "verified", color: "emerald" },
    { label: "Blocked", value: "blocked", color: "rose" },
  ];

  return (
    <div className="sticky top-[97px] z-40 bg-white border-b border-slate-200 px-6 py-5 shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Tab Filters */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(({ label, value, color }) => (
              <Button
                key={value}
                size="sm"
                variant={tab === value ? "default" : "outline"}
                onClick={() => setTab(value)}
                className={cn(
                  "h-10 px-5 font-medium transition-all",
                  tab === value &&
                    (color === "slate"
                      ? "bg-slate-800 hover:bg-slate-900"
                      : color === "amber"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : color === "emerald"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700")
                )}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by name, email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-11 pr-10 bg-slate-50 border-slate-200 focus:border-indigo-500 rounded-2xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}