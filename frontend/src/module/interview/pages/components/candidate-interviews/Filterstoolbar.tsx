import React from "react";
import { Calendar, ListTodo, Clock, Search, X } from "lucide-react";
import type { ModeFilter, StatusFilter, ViewMode } from "./Types";
import FilterSelect from "./Filterselect";
import {
  InterviewMode,
  InterviewStatus,
} from "@/module/interview/types/interview.types";

export interface FiltersToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  modeFilter: ModeFilter;
  onModeFilterChange: (value: ModeFilter) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const VIEW_TABS: { mode: ViewMode; icon: React.ElementType; label: string }[] =
  [
    { mode: "timeline", icon: Clock, label: "Timeline" },
    { mode: "calendar", icon: Calendar, label: "Calendar" },
    { mode: "list", icon: ListTodo, label: "List" },
  ];

export default function FiltersToolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  modeFilter,
  onModeFilterChange,
  hasActiveFilters,
  onClearFilters,
}: FiltersToolbarProps) {
  return (
    <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 mb-6 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {VIEW_TABS.map((item) => (
            <button
              key={item.mode}
              onClick={() => onViewModeChange(item.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === item.mode
                  ? "bg-white text-blue-700 font-semibold shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search by role or title…"
            className="w-full pl-8 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <FilterSelect
          value={statusFilter}
          onChange={(v) => onStatusFilterChange(v as StatusFilter)}
          options={[
            { value: "ALL", label: "All statuses" },
            { value: InterviewStatus.SCHEDULED, label: "Scheduled" },
            { value: InterviewStatus.RESCHEDULED, label: "Rescheduled" },
            { value: InterviewStatus.ONGOING, label: "Ongoing" },
            { value: InterviewStatus.COMPLETED, label: "Completed" },
            { value: InterviewStatus.CANCELLED, label: "Cancelled" },
            { value: InterviewStatus.NO_SHOW, label: "No Show" },
          ]}
        />
        <FilterSelect
          value={modeFilter}
          onChange={(v) => onModeFilterChange(v as ModeFilter)}
          options={[
            { value: "ALL", label: "All formats" },
            { value: InterviewMode.ONLINE, label: "Online" },
            { value: InterviewMode.OFFLINE, label: "In-person" },
          ]}
        />
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
