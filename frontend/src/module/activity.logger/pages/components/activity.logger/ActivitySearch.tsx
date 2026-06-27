import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ActivityLogsSearchProps {
  search: string;
  onSearch: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export function ActivityLogsSearch({
  search,
  onSearch,
  resultCount,
  totalCount,
}: ActivityLogsSearchProps) {
  const isFiltered = search.trim().length > 0;

  return (
    <div className="space-y-2">
      <div className="relative max-w-2xl group">
        <Search
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 pointer-events-none",
            isFiltered ? "text-indigo-500" : "text-slate-400",
          )}
        />
        <Input
          placeholder="Search by user, action, entity or description…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={cn(
            "h-11 pl-11 pr-10 bg-white shadow-sm rounded-xl text-sm transition-all duration-200 placeholder:text-slate-400",
            isFiltered
              ? "border-indigo-300 ring-1 ring-indigo-200 focus-visible:ring-indigo-400/40 focus-visible:border-indigo-400"
              : "border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400",
          )}
        />
        {isFiltered && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="h-3 w-3 text-slate-600" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Results summary */}
      {isFiltered && resultCount !== undefined && totalCount !== undefined && (
        <div className="flex items-center gap-1.5 pl-1">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <p className="text-[12px] text-slate-400 font-medium">
            Found{" "}
            <span className="text-indigo-600 font-bold">
              {resultCount.toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="text-slate-600 font-semibold">
              {totalCount.toLocaleString()}
            </span>{" "}
            events for{" "}
            <span className="text-indigo-600 font-semibold">"{search}"</span>
          </p>
        </div>
      )}
    </div>
  );
}
