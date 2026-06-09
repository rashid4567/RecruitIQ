
import { Search } from "lucide-react";
import { ApplicationTableRow } from "./Applicationtablerow";
import type { ApplicationRow } from "./Application.types";

interface ApplicationTableProps {
  rows: ApplicationRow[];
  selectedRows: Set<string>;
  isAllSelected: boolean;
  loading: boolean;
  error: string | null;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectRow: (id: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function ApplicationTable({
  rows,
  selectedRows,
  isAllSelected,
  loading,
  error,
  onToggleSelectAll,
  onToggleSelectRow,
  onRetry,
  onClearFilters,
}: ApplicationTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading applications…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-5 py-3.5 text-left w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onToggleSelectAll(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
              />
            </th>
            {["Candidate", "Applied", "AI Score", "Match", "Status", "Interview"].map(
              (col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {col}
                </th>
              ),
            )}
            <th className="px-5 py-3.5 w-10" />
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-5 py-16 text-center text-sm text-slate-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <Search size={24} className="opacity-30" />
                  <span>No applications match the current filters.</span>
                  <button
                    onClick={onClearFilters}
                    className="text-blue-600 text-xs hover:underline mt-1"
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
  );
}