import { Search, AlertCircle, RefreshCw, Users } from "lucide-react";
import { ApplicationTableRow } from "./Applicationtablerow";
import type { ApplicationRow } from "./Application.types";

interface ApplicationTableProps {
  rows: ApplicationRow[];
  selectedRows: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  loading: boolean;
  error: string | null;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectRow: (id: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
  onBulkAction?: (action: "shortlist" | "reject", ids: string[]) => void;
}

const COLUMNS = [
  { key: "candidate", label: "Candidate" },
  { key: "applied", label: "Applied" },
  { key: "ai", label: "AI Score" },
  { key: "match", label: "Match" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const SCORE_LEGEND = [
  { label: "80–100", dot: "bg-emerald-400" },
  { label: "60–79", dot: "bg-sky-400" },
  { label: "40–59", dot: "bg-amber-400" },
  { label: "0–39", dot: "bg-red-400" },
];

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-5 py-4">
        <div className="w-4 h-4 rounded bg-slate-100 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
            <div className="h-2.5 w-40 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="h-2.5 w-16 rounded bg-slate-100 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-1.5 w-16 rounded-full bg-slate-100 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-1.5 w-16 rounded-full bg-slate-100 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-20 rounded-full bg-slate-100 animate-pulse" />
      </td>
      <td className="px-5 py-4" />
    </tr>
  );
}

export function ApplicationTable({
  rows,
  selectedRows,
  isAllSelected,
  isIndeterminate,
  loading,
  error,
  onToggleSelectAll,
  onToggleSelectRow,
  onRetry,
  onClearFilters,
  onBulkAction,
}: ApplicationTableProps) {
  const checkboxRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = isIndeterminate;
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-xs">
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              Couldn't load applications
            </p>
            <p className="text-xs text-slate-400 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <RefreshCw size={13} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 border-b border-blue-100">
          <span className="text-sm font-medium text-blue-700">
            {selectedRows.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {onBulkAction && (
              <>
                <button
                  onClick={() => onBulkAction("shortlist", [...selectedRows])}
                  className="text-xs font-medium px-3 py-1.5 rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => onBulkAction("reject", [...selectedRows])}
                  className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {selectedRows.size === 0 && !loading && rows.length > 0 && (
        <div className="flex items-center gap-4 px-5 py-2 border-b border-slate-100 bg-slate-50/60">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
            AI Score
          </span>
          <div className="flex items-center gap-3">
            {SCORE_LEGEND.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-[11px] text-slate-500"
              >
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 sticky top-0 z-10 backdrop-blur">
              <th className="px-5 py-3.5 w-10">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  disabled={loading || rows.length === 0}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Select all rows"
                />
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-left text-[0.67rem] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Search size={18} className="text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        No applications found
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Try adjusting the filters or score range
                      </p>
                    </div>
                    <button
                      onClick={onClearFilters}
                      className="text-blue-600 text-xs font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <ApplicationTableRow
                  key={row.id}
                  row={row}
                  isSelected={selectedRows.has(row.id)}
                  onToggleSelect={onToggleSelectRow}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && rows.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users size={12} className="text-slate-300" />
            {rows.length} application{rows.length !== 1 ? "s" : ""}
          </span>
          {selectedRows.size > 0 && (
            <span className="text-xs text-slate-400">
              {selectedRows.size} of {rows.length} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
}
