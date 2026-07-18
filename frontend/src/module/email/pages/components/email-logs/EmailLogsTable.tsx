import { Mail, Inbox, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable } from "@/shared/table/DataTable";
import { EmptyState } from "@/shared/table/EmptyState";
import type { EmailLog } from "@/module/email/types/email.types";
import {
  Table as _Table, 
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmailLogsTableRow } from "./EmailLogsTableRow";
import { EmailLogsSkeletonRow } from "./EmailLogsSkeletonRow";
import { EmailLogsCard, EmailLogsSkeletonCard } from "./EmailLogsCard";

interface EmailLogsTableProps {
  logs: EmailLog[];
  loading: boolean;
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  perPageOptions: number[];
}

function MobilePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed active:bg-slate-50"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Prev
      </button>
      <span className="text-xs font-semibold text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed active:bg-slate-50"
      >
        Next <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

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
  const allSelected = logs.length > 0 && logs.every((l) => selectedIds.includes(l.id ?? ""));
  const someSelected = selectedIds.length > 0 && !allSelected;

  const headerContent = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/25">
          <Inbox className="h-4 w-4 text-white" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-slate-800 leading-none">Email Activity</h2>
          {!loading && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              {pagination.total.toLocaleString()} total records
            </p>
          )}
        </div>

        {selectedIds.length > 0 && (
          <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {selectedIds.length} selected
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-xs font-medium hidden sm:block">Rows</span>
        <Select value={pagination.limit.toString()} onValueChange={(v) => onLimitChange(Number(v))}>
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
  );

  return (
    <>
      {/* Table view — md and up */}
      <div className="hidden md:block">
        <DataTable
          loading={loading}
          isEmpty={logs.length === 0}
          hideFooterOnSinglePage
          headerContent={headerContent}
          skeletonRows={Array(8).fill(0).map((_, i) => <EmailLogsSkeletonRow key={i} />)}
          emptyState={
            <EmptyState
              icon={<Mail className="h-12 w-12 text-slate-400" />}
              title="No emails found"
              description="Try adjusting your filters or search query"
            />
          }
          header={
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
          }
          pagination={pagination}
          onPageChange={onPageChange}
        >
          {logs.map((log) => (
            <EmailLogsTableRow
              key={log.id}
              log={log}
              isSelected={selectedIds.includes(log.id ?? "")}
              onSelect={onSelectOne}
            />
          ))}
        </DataTable>
      </div>

      {/* Card view — below md */}
      <div className="md:hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="pb-3">{headerContent}</div>

        {!loading && logs.length > 0 && (
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 px-1 pb-3">
            <Checkbox
              checked={allSelected}
              ref={(el) => {
                if (el) (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected;
              }}
              onCheckedChange={onSelectAll}
              aria-label="Select all on page"
              className="border-slate-300"
            />
            Select all on page
          </label>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <EmailLogsSkeletonCard key={i} />
              ))}
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<Mail className="h-12 w-12 text-slate-400" />}
            title="No emails found"
            description="Try adjusting your filters or search query"
          />
        ) : (
          <>
            <div className="space-y-3">
              {logs.map((log) => (
                <EmailLogsCard
                  key={log.id}
                  log={log}
                  isSelected={selectedIds.includes(log.id ?? "")}
                  onSelect={onSelectOne}
                />
              ))}
            </div>
            <MobilePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </>
  );
}