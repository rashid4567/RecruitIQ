import { DataTable } from "@/shared/table/DataTable";
import { EmptyState } from "@/shared/table/EmptyState";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { JobPostRow, SkeletonRow } from "./Jobpostrow";
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
  );
}
