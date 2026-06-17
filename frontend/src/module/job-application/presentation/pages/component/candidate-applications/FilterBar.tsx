import React from "react";
import { Search, Download, SlidersHorizontal } from "lucide-react";
import { ApplicationStatus } from "../../../../domain/entity/job-application.entity";
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
  <div className="bg-white rounded-2xl border border-slate-100 px-4 py-3 mb-4 flex items-center gap-3 shadow-sm">
    <div className="flex items-center gap-2.5 flex-1 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100 focus-within:border-blue-300 focus-within:bg-white transition-colors">
      <Search size={14} className="text-slate-400 shrink-0" />
      <input
        type="text"
        placeholder="Search by job title or company…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 flex-1"
      />
    </div>

    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 hover:border-slate-200 transition-colors">
      <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
        className="text-[13px] text-slate-600 bg-transparent outline-none cursor-pointer pr-1"
      >
        <option value="ALL">All Status</option>
        {Object.values(ApplicationStatus).map((v) => (
          <option key={v} value={v}>
            {STATUS_CFG[v].label}
          </option>
        ))}
      </select>
    </div>

    <button className="flex items-center gap-2 text-[13px] text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 hover:bg-slate-100 hover:border-slate-200 transition font-medium whitespace-nowrap">
      <Download size={13} className="text-slate-400" />
      Export CSV
    </button>
  </div>
);
