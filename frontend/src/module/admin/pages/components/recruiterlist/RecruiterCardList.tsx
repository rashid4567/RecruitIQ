import { Building2, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";
import type { RecruiterAction } from "./RecruiterActionDialog";
import { RecruiterCard } from "./RecruiterCard";

interface RecruiterCardListProps {
  recruiters: RecruiterProfile[];
  loading: boolean;
  pagination: { total: number; page: number; limit: number; totalPages: number };
  actionLoading: Record<string, boolean>;
  onAction: (recruiter: RecruiterProfile, action: RecruiterAction) => void;
  onViewProfile: (id: string) => void;
  onPageChange: (page: number) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex min-h-20 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />
          <div className="min-w-0 flex-1">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
            <div className="mt-1.5 h-3 w-36 rounded bg-slate-200" />
          </div>
        </div>
        <div className="h-6 w-28 shrink-0 rounded-full bg-slate-200" />
      </div>

      <div className="my-4 h-px bg-slate-100" />

      <div className="grid grid-cols-2 gap-2.5">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg bg-slate-100 p-2.5">
              <div className="h-2.5 w-14 rounded bg-slate-200" />
              <div className="mt-1.5 h-4 w-20 rounded bg-slate-200" />
            </div>
          ))}
      </div>

      <div className="my-4 h-px bg-slate-100" />

      <div className="flex items-center gap-2">
        <div className="h-11 flex-1 rounded-lg bg-slate-200" />
        <div className="h-11 w-11 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function RecruiterCardList({
  recruiters,
  loading,
  pagination,
  actionLoading,
  onAction,
  onViewProfile,
  onPageChange,
  onResetFilters,
  hasActiveFilters = false,
}: RecruiterCardListProps) {
  const rangeStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeEnd = Math.min(pagination.page * pagination.limit, pagination.total);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <CardSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (recruiters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Building2 className="h-7 w-7 text-slate-400" />
        </div>

        <div className="mt-4 font-semibold text-slate-800">
          No Recruiters Found
        </div>

        <div className="mt-1 max-w-xs text-sm text-slate-500">
          There aren't any recruiters matching your current search.
        </div>

        {hasActiveFilters && onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 gap-1.5"
            onClick={onResetFilters}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recruiters.map((recruiter) => (
          <RecruiterCard
            key={recruiter.id}
            recruiter={recruiter}
            isActionLoading={actionLoading[recruiter.id] || false}
            onAction={onAction}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2.5 px-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-medium text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {rangeStart}–{rangeEnd}
          </span>{" "}
          of <span className="font-semibold text-slate-700">{pagination.total}</span>
        </span>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-slate-600"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-xs font-medium text-slate-500">
            Page {pagination.page} of {pagination.totalPages || 1}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-slate-600"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}