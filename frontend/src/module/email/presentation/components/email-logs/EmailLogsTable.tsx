import {
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { EmailLog } from "../../../../email/domain/entity/email-log.entity";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmailLogsTableRow } from "./EmailLogsTableRow";
import { EmailLogsSkeletonRow } from "./EmailLogsSkeletonRow";

interface EmailLogsTableProps {
  logs: EmailLog[];
  loading: boolean;
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  perPageOptions: number[];
}

/* ─── Page number pills ─────────────────────────────────────── */

function PagePills({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const MAX = 7;
  const half = Math.floor(MAX / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + MAX - 1);
  if (end - start < MAX - 1) start = Math.max(1, end - MAX + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center gap-1">
      {start > 1 && (
        <>
          <PageBtn n={1} active={false} onClick={() => onPageChange(1)} />
          {start > 2 && <span className="px-1 text-slate-300 text-xs">…</span>}
        </>
      )}
      {pages.map((n) => (
        <PageBtn key={n} n={n} active={n === page} onClick={() => onPageChange(n)} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-300 text-xs">…</span>}
          <PageBtn n={totalPages} active={false} onClick={() => onPageChange(totalPages)} />
        </>
      )}
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

/* ─── Main ──────────────────────────────────────────────────── */

export function EmailLogsTable({
  logs,
  loading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  pagination,
  onPageChange,
  onLimitChange,
  perPageOptions,
}: EmailLogsTableProps) {
  const allSelected = logs.length > 0 && logs.every((l) =>
    selectedIds.includes(l.getId() ?? ""),
  );
  const someSelected = selectedIds.length > 0 && !allSelected;

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <Card className="border border-slate-200/70 shadow-sm rounded-2xl overflow-hidden">

      {/* ── Table header bar ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/25">
            <Inbox className="h-4 w-4 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-800 leading-none">
              Email Activity
            </h2>
            {!loading && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {pagination.total.toLocaleString()} total records
              </p>
            )}
          </div>

          {/* Bulk selection indicator */}
          {selectedIds.length > 0 && (
            <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {/* Rows per page */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-medium hidden sm:block">Rows</span>
          <Select
            value={pagination.limit.toString()}
            onValueChange={(v) => onLimitChange(Number(v))}
          >
            <SelectTrigger className="w-16 h-8 rounded-lg border-slate-200 text-sm font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((n) => (
                <SelectItem key={n} value={n.toString()} className="text-sm">
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
              <TableHead className="pl-6 w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected;
                  }}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                  className="border-slate-300"
                />
              </TableHead>
              <TableHead className="w-44 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Sent At
              </TableHead>
              <TableHead className="w-56 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recipient
              </TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Subject
              </TableHead>
              <TableHead className="w-28 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Type
              </TableHead>
              <TableHead className="w-28 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="pr-6 w-20 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array(8).fill(0).map((_, i) => <EmailLogsSkeletonRow key={i} />)
            ) : logs.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Mail className="h-7 w-7 text-slate-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-[15px] font-semibold text-slate-600">
                      No emails found
                    </p>
                    <p className="text-sm text-slate-400">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                </td>
              </TableRow>
            ) : (
              logs.map((log) => (
                <EmailLogsTableRow
                  key={log.getId()}
                  log={log}
                  isSelected={selectedIds.includes(log.getId() ?? "")}
                  onSelect={onSelectOne}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination footer ── */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          {/* Results summary */}
          <p className="text-[12px] text-slate-400 font-medium">
            Showing{" "}
            <span className="text-slate-700 font-bold">{start.toLocaleString()}</span>
            {" – "}
            <span className="text-slate-700 font-bold">{end.toLocaleString()}</span>
            {" of "}
            <span className="text-slate-700 font-bold">{pagination.total.toLocaleString()}</span>
            {" results"}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {/* First */}
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(1)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            {/* Prev */}
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <PagePills
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />

            {/* Next */}
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            {/* Last */}
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.totalPages)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}