/**
 * DataTable.tsx
 * ─────────────
 * Universal admin table shell.
 * Owns: card wrapper, column headers, skeleton rows, empty state, pagination.
 * Does NOT own: row rendering — that stays in each feature file via `renderRow`.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * Minimal usage:
 *
 *   <DataTable
 *     title="Recruiters"
 *     columns={RECRUITER_COLUMNS}
 *     data={recruiters}
 *     loading={loading}
 *     pagination={pagination}
 *     onPageChange={setPage}
 *     skeletonCellWidths={["avatar+text", "badge", "badge", "center-sm", "center-md", "text", "action"]}
 *     renderRow={(r) => <RecruiterRow key={r.id} recruiter={r} ... />}
 *   />
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef {
  key: string;
  label: string;
  /** Tailwind width class e.g. "w-[28%]" */
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export type SkeletonCellPreset =
  | "avatar+text"  // avatar circle + two text lines
  | "badge"        // standard pill
  | "badge-sm"     // narrower pill
  | "center-sm"    // short value centered (e.g. a count)
  | "center-md"    // medium width centered (e.g. a status badge)
  | "text"         // plain text line
  | "text-icon"    // small icon + text line
  | "action"       // icon button(s) right-aligned
  | "tag-group"    // two side-by-side pills (e.g. skills)
  | "toggle";      // status dot + badge + toggle switch

export interface DataTablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableProps<T> {
  /** Card heading text */
  title: string;
  /** Column header definitions */
  columns: ColumnDef[];
  /** Row data */
  data: T[];
  /** Show skeleton loading state */
  loading?: boolean;
  /** Pagination state */
  pagination: DataTablePagination;
  onPageChange: (page: number) => void;
  /** Pass to show a rows-per-page selector in the header */
  onLimitChange?: (limit: number) => void;
  /** Render one <tr> per data item — you supply the key */
  renderRow: (item: T, index: number) => ReactNode;
  /** Number of skeleton rows shown while loading (default 6) */
  skeletonRowCount?: number;
  /**
   * One preset per column — drives the skeleton shimmer.
   * Length must equal columns.length.
   */
  skeletonCellWidths: SkeletonCellPreset[];
  /** Text shown when data array is empty */
  emptyMessage?: string;
  /** If provided, a Refresh button appears on the empty state */
  onRefresh?: () => void;
  /** Slot extra content (filters, search, buttons) into the card header */
  headerActions?: ReactNode;
  /** Minimum table width Tailwind class (default "min-w-[900px]") */
  minWidth?: string;
}

// ─── SkeletonCell ─────────────────────────────────────────────────────────────

function SkeletonCell({
  preset,
  isLast,
}: {
  preset: SkeletonCellPreset;
  isLast: boolean;
}) {
  const cell = (className: string, children: ReactNode) => (
    <td className={cn("px-5 py-5", className)}>{children}</td>
  );

  const shimmer = (className: string) => (
    <div className={cn("bg-slate-200 animate-pulse rounded", className)} />
  );

  switch (preset) {
    case "avatar+text":
      return cell("px-6", (
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2 flex-1">
            {shimmer("h-4 w-32")}
            {shimmer("h-3 w-48")}
          </div>
        </div>
      ));

    case "badge":
      return cell("", shimmer("h-6 w-24 rounded-full"));

    case "badge-sm":
      return cell("", shimmer("h-6 w-16 rounded-full"));

    case "center-sm":
      return cell("text-center", (
        <div className="flex justify-center">{shimmer("h-5 w-8")}</div>
      ));

    case "center-md":
      return cell("text-center", (
        <div className="flex justify-center">{shimmer("h-6 w-20 rounded-full")}</div>
      ));

    case "text":
      return cell("", shimmer("h-4 w-28"));

    case "text-icon":
      return cell("", (
        <div className="flex items-center gap-2">
          {shimmer("h-4 w-4 rounded")}
          {shimmer("h-4 w-20")}
        </div>
      ));

    case "tag-group":
      return cell("", (
        <div className="flex gap-1.5">
          {shimmer("h-6 w-16 rounded-full")}
          {shimmer("h-6 w-20 rounded-full")}
        </div>
      ));

    case "toggle":
      return cell("text-center", (
        <div className="flex items-center justify-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-200 animate-pulse" />
          {shimmer("h-6 w-16 rounded-full")}
          {shimmer("h-6 w-11 rounded-full")}
        </div>
      ));

    case "action":
      return cell(cn("text-right", isLast && "pr-8"), (
        <div className="flex items-center justify-end gap-2">
          {shimmer("h-8 w-8 rounded-lg")}
        </div>
      ));

    default:
      return cell("", shimmer("h-4 w-24"));
  }
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

function SkeletonRow({ cells }: { cells: SkeletonCellPreset[] }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      {cells.map((preset, i) => (
        <SkeletonCell key={i} preset={preset} isLast={i === cells.length - 1} />
      ))}
    </tr>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  message = "No records found",
  onRefresh,
}: {
  message?: string;
  onRefresh?: () => void;
}) {
  return (
    <tr>
      <td colSpan={99}>
        <div className="flex flex-col items-center justify-center h-72 gap-4">
          <Inbox className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
          <p className="text-base font-medium text-slate-500">{message}</p>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="gap-2 text-slate-500 hover:text-indigo-600"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── TablePagination ──────────────────────────────────────────────────────────

function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}) {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">{startItem}</span>
        {" – "}
        <span className="font-medium text-slate-700">{endItem}</span>
        {" of "}
        <span className="font-medium text-slate-700">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-400 select-none">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 text-sm"
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  title,
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onLimitChange,
  renderRow,
  skeletonRowCount = 6,
  skeletonCellWidths,
  emptyMessage,
  onRefresh,
  headerActions,
  minWidth = "min-w-[900px]",
}: DataTableProps<T>) {
  const { page, limit, total, totalPages } = pagination;
  const LIMIT_OPTIONS = [10, 20, 50, 100];

  return (
    <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">

      {/* ── Card header ── */}
      <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              {total.toLocaleString()} total
            </p>
          </div>

          <div className="flex items-center gap-3">
            {headerActions}

            {onLimitChange && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="hidden sm:inline">Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="h-8 px-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
                >
                  {LIMIT_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className={cn("w-full", minWidth)}>

          {/* Column headers */}
          <thead className="bg-slate-50/70 sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider",
                    // first and last column get extra horizontal padding
                    i === 0 ? "px-6" : "px-5",
                    i === columns.length - 1 && "pr-8",
                    col.align === "center" && "text-center",
                    col.align === "right"  && "text-right",
                    (!col.align || col.align === "left") && "text-left",
                    col.width,
                    col.className,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              Array(skeletonRowCount).fill(0).map((_, i) => (
                <SkeletonRow key={i} cells={skeletonCellWidths} />
              ))
            ) : data.length === 0 ? (
              <EmptyState message={emptyMessage} onRefresh={onRefresh} />
            ) : (
              data.map((item, i) => renderRow(item, i))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}