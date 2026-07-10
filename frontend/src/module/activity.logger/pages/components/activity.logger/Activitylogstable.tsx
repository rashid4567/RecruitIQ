import { Activity, SlidersHorizontal } from "lucide-react";
import { DataTable } from "@/shared/table/DataTable";
import { EmptyState } from "@/shared/table/EmptyState";
import {
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import type { ActivityLog } from "@/module/activity.logger/types/activity-log.types";
import { ActivityLogsTableRow } from "./Activitylogstablerow";
import { ActivityLogsSkeletonRow } from "@/module/activity.logger/pages/components/activity.logger/ActivityLogsSkeletonRow";

interface ActivityLogsTableProps {
  paginated: ActivityLog[];
  filtered: ActivityLog[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  totalPages: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  search: string;
}

export function ActivityLogsTable({
  paginated,
  filtered,
  loading,
  pagination,
  totalPages,
  onChangePage,
  onChangeLimit,
  search,
}: ActivityLogsTableProps) {
  return (
    <DataTable
      loading={loading}
      isEmpty={paginated.length === 0}
      hideFooterOnSinglePage
      headerContent={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/25">
              <Activity className="h-4 w-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-800 leading-none">
                Activity Stream
              </h2>
              {!loading && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {filtered.length.toLocaleString()} event
                  {filtered.length !== 1 ? "s" : ""}
                  {search && (
                    <span className="text-indigo-500 font-semibold"> (filtered)</span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 hidden sm:block">Rows</span>
            <select
              value={pagination.limit}
              onChange={(e) => onChangeLimit(Number(e.target.value))}
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      }
      skeletonRows={Array(10).fill(0).map((_, i) => <ActivityLogsSkeletonRow key={i} />)}
      emptyState={
        <EmptyState
          icon={<Activity className="h-12 w-12 text-slate-400" />}
          title="No activity logs found"
          description={search ? "Try adjusting your search" : "No events have been recorded yet"}
        />
      }
      header={
        <TableHeader>
          <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
            <TableHead className="pl-6 w-12" />
            <TableHead className="w-36 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Date
            </TableHead>
            <TableHead className="w-28 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
              When
            </TableHead>
            <TableHead className="w-28 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Level
            </TableHead>
            <TableHead className="w-56 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Actor
            </TableHead>
            <TableHead className="w-44 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Entity
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Description
            </TableHead>
            <TableHead className="pr-6 w-14" />
          </TableRow>
        </TableHeader>
      }
      pagination={{ page: pagination.page, limit: pagination.limit, total: filtered.length, totalPages }}
      onPageChange={onChangePage}
    >
      {paginated.map((log, idx) => (
        <ActivityLogsTableRow key={idx} log={log} />
      ))}
    </DataTable>
  );
}