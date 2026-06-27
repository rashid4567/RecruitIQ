import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@/module/activity.logger/types/activity-log.types";
import { ActivityLogsTableRow } from "./Activitylogstablerow";

const SkeletonRow = () => (
  <TableRow className="border-b border-slate-100">
    <TableCell className="pl-6 w-12">
      <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
    </TableCell>
    <TableCell className="w-36">
      <div className="space-y-1.5">
        <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
      </div>
    </TableCell>
    <TableCell className="w-28 hidden lg:table-cell">
      <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
    </TableCell>
    <TableCell className="w-28">
      <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
    </TableCell>
    <TableCell className="w-56">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </TableCell>
    <TableCell className="w-44">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-1.5">
        <div className="h-3.5 w-3/4 bg-slate-100 rounded animate-pulse" />
        <div className="h-3.5 w-1/2 bg-slate-100 rounded animate-pulse" />
      </div>
    </TableCell>
    <TableCell className="pr-6 w-14">
      <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse ml-auto" />
    </TableCell>
  </TableRow>
);

function PaginationNav({
  page,
  totalPages,
  onChangePage,
}: {
  page: number;
  totalPages: number;
  onChangePage: (p: number) => void;
}) {
  const MAX = 7;
  const half = Math.floor(MAX / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + MAX - 1);
  if (end - start < MAX - 1) start = Math.max(1, end - MAX + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const NavBtn = ({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-xs"
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      <NavBtn onClick={() => onChangePage(1)} disabled={page === 1}>
        <ChevronsLeft className="h-3.5 w-3.5" />
      </NavBtn>
      <NavBtn onClick={() => onChangePage(page - 1)} disabled={page === 1}>
        <ChevronLeft className="h-3.5 w-3.5" />
      </NavBtn>

      <div className="flex items-center gap-0.5 mx-1">
        {start > 1 && (
          <>
            <PageBtn n={1} active={false} onClick={() => onChangePage(1)} />
            {start > 2 && (
              <span className="w-6 text-center text-slate-300 text-xs">…</span>
            )}
          </>
        )}
        {pages.map((n) => (
          <PageBtn
            key={n}
            n={n}
            active={n === page}
            onClick={() => onChangePage(n)}
          />
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="w-6 text-center text-slate-300 text-xs">…</span>
            )}
            <PageBtn
              n={totalPages}
              active={false}
              onClick={() => onChangePage(totalPages)}
            />
          </>
        )}
      </div>

      <NavBtn
        onClick={() => onChangePage(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </NavBtn>
      <NavBtn
        onClick={() => onChangePage(totalPages)}
        disabled={page >= totalPages}
      >
        <ChevronsRight className="h-3.5 w-3.5" />
      </NavBtn>
    </div>
  );
}

function PageBtn({
  n,
  active,
  onClick,
}: {
  n: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 w-8 rounded-lg text-sm font-semibold transition-all duration-150",
        active
          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
      )}
    >
      {n}
    </button>
  );
}

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
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, filtered.length);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
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
                  <span className="text-indigo-500 font-semibold">
                    {" "}
                    (filtered)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">
            Rows
          </span>
          <select
            value={pagination.limit}
            onChange={(e) => onChangeLimit(Number(e.target.value))}
            className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
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

          <TableBody>
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Activity
                        className="h-7 w-7 text-slate-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-[15px] font-semibold text-slate-600">
                      No activity logs found
                    </p>
                    <p className="text-sm text-slate-400">
                      {search
                        ? "Try adjusting your search"
                        : "No events have been recorded yet"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((log, idx) => (
                <ActivityLogsTableRow key={idx} log={log} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          {/* Summary */}
          <p className="text-[12px] text-slate-400 font-medium">
            Showing{" "}
            <span className="text-slate-700 font-bold">
              {start.toLocaleString()}
            </span>
            {" – "}
            <span className="text-slate-700 font-bold">
              {end.toLocaleString()}
            </span>
            {" of "}
            <span className="text-slate-700 font-bold">
              {filtered.length.toLocaleString()}
            </span>
            {" events"}
          </p>

          <PaginationNav
            page={pagination.page}
            totalPages={totalPages}
            onChangePage={onChangePage}
          />
        </div>
      )}
    </div>
  );
}
