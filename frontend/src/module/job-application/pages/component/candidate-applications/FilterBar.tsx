import React from "react";
import { Search, Download, SlidersHorizontal } from "lucide-react";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";
import { STATUS_CFG } from "./Helpers";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  statusFilter: "ALL" | ApplicationStatus;
  onStatusFilter: (v: string) => void;
}

export const FilterBar: React.FC<Props> = ({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
}) => (
  <div
    className="
      mb-4
      rounded-xl sm:rounded-2xl
      border border-slate-200/70
      bg-white
      p-3 sm:p-4
      shadow-sm
    "
  >
    <div
      className="
        flex flex-col gap-2.5
        sm:flex-row sm:items-center
      "
    >
      <div
        className="
          flex min-w-0 flex-1
          items-center gap-2.5
          rounded-xl
          border border-slate-200
          bg-slate-50/70
          px-3.5
          transition-all
          focus-within:border-blue-400
          focus-within:bg-white
          focus-within:ring-2
          focus-within:ring-blue-100
        "
      >
        <Search size={15} className="shrink-0 text-slate-400" />

        <input
          type="search"
          placeholder="Search by job title or company…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="
            min-w-0 flex-1
            bg-transparent
            py-2.5
            text-sm text-slate-800
            outline-none
            placeholder:text-slate-400
          "
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
        <div
          className="
            relative
            flex min-w-0
            items-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            px-3
            transition-colors
            hover:border-slate-300
          "
        >
          <SlidersHorizontal size={14} className="shrink-0 text-slate-400" />

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            aria-label="Filter applications by status"
            className="
              min-w-0 flex-1
              cursor-pointer
              bg-transparent
              py-2.5
              text-sm text-slate-600
              outline-none
            "
          >
            <option value="ALL">All Statuses</option>
            {Object.values(ApplicationStatus).map((v) => (
              <option key={v} value={v}>
                {STATUS_CFG[v].label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="
            inline-flex min-h-10
            items-center justify-center gap-2
            whitespace-nowrap
            rounded-xl
            border border-slate-200
            bg-white
            px-3 sm:px-4
            text-sm font-medium
            text-slate-600
            transition-all
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-900
          "
        >
          <Download size={14} className="shrink-0 text-slate-400" />
          <span className="hidden min-[360px]:inline">Export</span>
          <span className="hidden lg:inline">CSV</span>
        </button>
      </div>
    </div>

    {(search || statusFilter !== "ALL") && (
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-400">
          Active filters:
        </span>

        {search && (
          <span
            className="
              inline-flex max-w-45
              items-center rounded-full
              bg-blue-50
              px-2.5 py-1
              text-xs font-medium text-blue-700
            "
          >
            <span className="truncate">Search: {search}</span>
          </span>
        )}

        {statusFilter !== "ALL" && (
          <span
            className="
              inline-flex items-center
              rounded-full
              bg-slate-100
              px-2.5 py-1
              text-xs font-medium text-slate-600
            "
          >
            {STATUS_CFG[statusFilter].label}
          </span>
        )}
      </div>
    )}
  </div>
);
