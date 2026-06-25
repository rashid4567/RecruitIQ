import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JobPostRow } from "./Jobpostrow";
import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";

function SkeletonRow() {
  return (
    <tr>
      {[28, 15, 12, 18, 8, 12, 7].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-4 rounded-md bg-slate-100 animate-pulse"
            style={{ width: `${w * 3}px` }}
          />
          {i === 0 && (
            <div className="h-3 w-20 rounded-md bg-slate-100 animate-pulse mt-2" />
          )}
        </td>
      ))}
    </tr>
  );
}

function THead() {
  return (
    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
      <tr>
        {[
          { label: "Job", cls: "w-[28%] pl-6" },
          { label: "Type", cls: "w-[12%]" },
          { label: "Status", cls: "w-[10%]" },
          { label: "Applications", cls: "w-[14%]" },
          { label: "Active", cls: "w-[8%] text-center" },
          { label: "Posted", cls: "w-[12%]" },
          { label: "", cls: "w-[6%]" },
        ].map(({ label, cls }) => (
          <th
            key={label}
            className={cn(
              "px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest",
              cls,
            )}
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  total: number;
  limit: number;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
  limit,
}: PaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const windowSize = Math.min(totalPages, 5);
  const pages = Array.from({ length: windowSize }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {from}–{to}
        </span>{" "}
        of <span className="font-semibold text-slate-800">{total}</span> jobs
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="h-8 w-8 p-0 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {totalPages > 5 && page > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-8 h-8 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
              >
                1
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">
                …
              </span>
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-8 h-8 text-sm font-semibold rounded-lg transition-all",
                page === p
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {p}
            </button>
          ))}

          {totalPages > 5 && page < totalPages - 2 && (
            <>
              <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">
                …
              </span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="h-8 w-8 p-0 rounded-lg disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface JobPostTableProps {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  pendingId: string | null;
  onPageChange: (p: number) => void;
  onToggleBlock: (job: Job) => void;
  onViewJob: (job: Job) => void;
}

export function JobPostTable({
  jobs,
  total,
  page,
  limit,
  totalPages,
  loading,
  pendingId,
  onPageChange,
  onToggleBlock,
  onViewJob,
}: JobPostTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <THead />
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)
              : jobs.map((job) => (
                  <JobPostRow
                    key={job.id}
                    job={job}
                    onView={onViewJob}
                    onToggleBlock={onToggleBlock}
                    isPending={pendingId === job.id}
                  />
                ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        total={total}
        limit={limit}
      />
    </Card>
  );
}
