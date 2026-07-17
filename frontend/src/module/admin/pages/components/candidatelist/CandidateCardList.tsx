import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CandidateListItem } from "@/module/admin/types/candidate.types";
import { CandidateCard } from "./CandidateCard";

interface CandidateCardListProps {
  candidates: CandidateListItem[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  loadingMap: Record<string, boolean>;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onToggleStatus: (id: string, name: string, action: "block" | "unblock") => void;
  onViewProfile: (id: string) => void;
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-3 w-40 bg-slate-200 rounded mt-2" />
        </div>
      </div>
      <div className="h-3 w-full bg-slate-200 rounded mt-4" />
      <div className="h-9 w-full bg-slate-200 rounded mt-4" />
    </div>
  );
}

export function CandidateCardList({
  candidates,
  loading,
  pagination,
  loadingMap,
  onPageChange,
  onRefresh,
  onToggleStatus,
  onViewProfile,
}: CandidateCardListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-xl border border-dashed border-slate-300 bg-white">
        <Users className="h-12 w-12 text-slate-400" />
        <div className="mt-3 font-medium text-slate-800">No Candidates Found</div>
        <div className="text-sm text-slate-500 mt-1">Try changing the search or filters.</div>
        <Button variant="outline" className="mt-4 rounded-lg" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isActionLoading={loadingMap[candidate.id]}
            onToggleStatus={onToggleStatus}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-slate-500">
          Page {pagination.page} / {pagination.totalPages || 1}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}