"use client";

import { useCallback } from "react";
import { Search } from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";
import type { UpdateApplicationStatusDTO } from "@/module/job-application/domain/dto/updateApplicationStatus.dto";
import { ALL_STATUSES, STATUS_LABELS } from "./Status.constants";
import { useUpdateApplicationStatus } from "../../../hooks/recruiter/useUpdateApplicationStatus";
import type { SortOption } from "./Application.types";

// Only the statuses a recruiter is allowed to set
type RecruiterSetableStatus = UpdateApplicationStatusDTO["status"];

interface FilterToolbarProps {
  searchQuery: string;
  sortBy: SortOption;
  statusFilter: ApplicationStatus | "All";
  matchScoreRange: number;
  selectedIds: string[];
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onStatusChange: (value: ApplicationStatus | "All") => void;
  onMatchScoreChange: (value: number) => void;
  onClearSelection: () => void;
  onBulkSuccess: () => void;
}

export function FilterToolbar({
  searchQuery,
  sortBy,
  statusFilter,
  matchScoreRange,
  selectedIds,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onMatchScoreChange,
  onClearSelection,
  onBulkSuccess,
}: FilterToolbarProps) {
  const { loading, updateStatus } = useUpdateApplicationStatus();

  const handleBulkUpdate = useCallback(
    async (status: RecruiterSetableStatus) => {
      if (selectedIds.length === 0) return;

      const results = await Promise.all(
        selectedIds.map((applicationId) =>
          updateStatus({ applicationId, status }),
        ),
      );

      if (results.every(Boolean)) {
        onClearSelection();
        onBulkSuccess();
      }
    },
    [selectedIds, updateStatus, onClearSelection, onBulkSuccess],
  );

  const selectedCount = selectedIds.length;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Sort
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option>Application Date</option>
            <option>Match Score</option>
            <option>AI Score</option>
            <option>Name</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as ApplicationStatus | "All")
            }
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Match score range */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide whitespace-nowrap">
            Match ≤ {matchScoreRange}%
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={matchScoreRange}
            onChange={(e) => onMatchScoreChange(Number(e.target.value))}
            className="w-32 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Bulk actions */}
      {selectedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-sm">
          <span className="text-slate-700 font-semibold">
            {selectedCount} selected
          </span>

          <button
            disabled={loading}
            onClick={() => handleBulkUpdate("SHORTLISTED")}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Move to Shortlisted
          </button>

          <button
            disabled={loading}
            onClick={() => handleBulkUpdate("SELECTED")}
            className="text-purple-600 hover:text-purple-700 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Schedule Interview
          </button>

          <button
            disabled={loading}
            onClick={() => handleBulkUpdate("REJECTED")}
            className="text-red-500 hover:text-red-600 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject
          </button>

          {loading && (
            <span className="text-slate-400 text-xs flex items-center gap-1.5">
              <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin inline-block" />
              Updating…
            </span>
          )}

          <button
            onClick={onClearSelection}
            className="ml-auto text-slate-400 hover:text-slate-600 text-xs"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}