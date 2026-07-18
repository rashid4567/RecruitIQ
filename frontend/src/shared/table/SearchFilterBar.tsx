import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterOption<T extends string> {
  label: string;
  value: T;
  activeClassName: string;
}

interface SearchFilterBarProps<T extends string> {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: FilterOption<T>[];
  activeFilter: T;
  onFilterChange: (value: T) => void;
}

export function SearchFilterBar<T extends string>({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filters,
  activeFilter,
  onFilterChange,
}: SearchFilterBarProps<T>) {
  return (
    <div className=" top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-sm">
      {" "}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-10 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-400 rounded-lg"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map(({ label, value, activeClassName }) => (
            <Button
              key={value}
              size="sm"
              variant={activeFilter === value ? "default" : "outline"}
              className={cn(
                "h-9 px-4 text-sm font-medium transition-all duration-200",
                activeFilter === value
                  ? activeClassName
                  : "border-slate-200 hover:bg-slate-50",
              )}
              onClick={() => onFilterChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
