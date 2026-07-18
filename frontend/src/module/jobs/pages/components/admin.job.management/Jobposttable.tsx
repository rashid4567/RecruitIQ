import { DataTable } from "@/shared/table/DataTable";
import { EmptyState } from "@/shared/table/EmptyState";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { JobPostRow, SkeletonRow, JobPostCard, SkeletonCard } from "./Jobpostrow";
import type { Job } from "@/module/jobs/types/job.types";

function JobPostTableHeader() {
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

interface MobilePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function MobilePagination({ page, totalPages, onPageChange }: MobilePaginationProps) {
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
  onRefresh: () => void;
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
  onRefresh,
}: JobPostTableProps) {
  return (
    <>
  
      <div className="hidden md:block">
        <DataTable
          loading={loading}
          isEmpty={jobs.length === 0}
          skeletonRows={Array(5)
            .fill(0)
            .map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          emptyState={
            <EmptyState
              icon={<Briefcase className="h-12 w-12 text-slate-400" />}
              title="No job posts found"
              description="Try adjusting your search query or filter tabs to find what you're looking for."
              onRefresh={onRefresh}
            />
          }
          header={<JobPostTableHeader />}
          pagination={{ page, limit, total, totalPages }}
          onPageChange={onPageChange}
        >
          {jobs.map((job) => (
            <JobPostRow
              key={job.id}
              job={job}
              onView={onViewJob}
              onToggleBlock={onToggleBlock}
              isPending={pendingId === job.id}
            />
          ))}
        </DataTable>
      </div>

      {/* Card view — below md */}
      <div className="md:hidden">
        {loading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-12 w-12 text-slate-400" />}
            title="No job posts found"
            description="Try adjusting your search query or filter tabs to find what you're looking for."
            onRefresh={onRefresh}
          />
        ) : (
          <>
            <div className="space-y-3">
              {jobs.map((job) => (
                <JobPostCard
                  key={job.id}
                  job={job}
                  onView={onViewJob}
                  onToggleBlock={onToggleBlock}
                  isPending={pendingId === job.id}
                />
              ))}
            </div>
            <MobilePagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </>
  );
}