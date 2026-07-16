import type { RefObject } from "react";
import { Loader2, RotateCcw, Search, X } from "lucide-react";
import type { ModeFilter, StatusFilter } from "./Interviewdashboard.types";
import {
  MODE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "./Interviewdashboard.helpers";

export default function FilterBar({
  searchInputRef,
  searchInput,
  onSearchChange,
  onClearSearch,
  isSearchPending,
  statusFilter,
  onStatusFilterChange,
  modeFilter,
  onModeFilterChange,
  activeFilterCount,
  onReset,
}: {
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  isSearchPending: boolean;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  modeFilter: ModeFilter;
  onModeFilterChange: (value: ModeFilter) => void;
  activeFilterCount: number;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:px-6">
      <div className="relative w-full sm:max-w-105">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          ref={searchInputRef}
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search candidate, email, position…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {isSearchPending ? (
          <Loader2
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
          />
        ) : searchInput ? (
          <button
            onClick={onClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={modeFilter}
          onChange={(e) => onModeFilterChange(e.target.value as ModeFilter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {MODE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            <RotateCcw size={12} />
            Reset ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
}