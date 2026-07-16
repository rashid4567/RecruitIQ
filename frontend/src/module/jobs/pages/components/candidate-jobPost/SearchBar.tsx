import React, { useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, Command } from "lucide-react";
import type { JobPostFilters } from "@/module/jobs/types/JobPostDTO";

interface SearchBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onClear: () => void;
  onMobileFilterOpen: () => void;
  filters: JobPostFilters;
}

function countActiveFilters(filters: JobPostFilters): number {
  let count = 0;
  if (filters.department !== undefined) count++;
  if (filters.jobType !== undefined) count++;
  if (filters.isRemote !== undefined) count++;
  if (
    filters.experienceMin !== undefined ||
    filters.experienceMax !== undefined
  )
    count++;
  return count;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchInput,
  onSearchInputChange,
  onClear,
  onMobileFilterOpen,
  filters,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeFilterCount = countActiveFilters(filters);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="lg:sticky lg:top-16 lg:z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
        <div className="flex-1 relative group">
          <div className="absolute -inset-[1.5px] rounded-[14px] bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-[1px]" />
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[13px] group-focus-within:bg-white group-focus-within:border-transparent transition-all duration-200">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200 pointer-events-none shrink-0" />

            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Search by title, skill, or keyword..."
              aria-label="Search jobs"
              className="w-full h-11 pl-10 pr-24 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
              {searchInput ? (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Clear search"
                  className="pointer-events-auto w-6 h-6 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-slate-500 transition-all duration-150"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-400 font-mono">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onMobileFilterOpen}
          aria-label="Open filters"
          className="lg:hidden relative flex items-center gap-2 px-4 h-11 border border-slate-200 rounded-[13px] text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-150 bg-white shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-indigo-200 ring-2 ring-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
