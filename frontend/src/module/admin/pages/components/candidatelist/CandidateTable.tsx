import { DataTable } from "@/shared/table/DataTable";
import { RowsPerPageSelect } from "@/shared/table/RowsPerPageSelect";
import { EmptyState } from "@/shared/table/EmptyState";
import { Users } from "lucide-react";
import type { CandidateListItem } from "@/module/admin/types/candidate.types";
import { CandidateRow } from "./CandidateRow";
import { CandidateSkeleton } from "./CandidateSkeleton";

interface CandidateTableProps {
  candidates: CandidateListItem[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  loadingMap: Record<string, boolean>;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  onToggleStatus: (id: string, name: string, action: "block" | "unblock") => void;
  onViewProfile: (id: string) => void;
}

export function CandidateTable({
  candidates,
  loading,
  pagination,
  loadingMap,
  onPageChange,
  onLimitChange,
  onRefresh,
  onToggleStatus,
  onViewProfile,
}: CandidateTableProps) {
  return (
    <DataTable
      title="Candidate List"
      description={loading ? "Loading candidates..." : `${pagination.total} total candidates`}
      rightSlot={<RowsPerPageSelect value={pagination.limit} onChange={onLimitChange} />}
      loading={loading}
      isEmpty={candidates.length === 0}
      skeletonRows={Array(5).fill(0).map((_, i) => <CandidateSkeleton key={i} />)}
      emptyState={
        <EmptyState
          icon={<Users className="h-12 w-12 text-slate-400" />}
          title="No candidates found"
          onRefresh={onRefresh}
        />
      }
      header={<CandidateTableHeader />}
      pagination={pagination}
      onPageChange={onPageChange}
    >
      {candidates.map((candidate) => (
        <CandidateRow
          key={candidate.id}
          candidate={candidate}
          isActionLoading={loadingMap[candidate.id]}
          onToggleStatus={onToggleStatus}
          onViewProfile={onViewProfile}
        />
      ))}
    </DataTable>
  );
}

function CandidateTableHeader() {
  return (
    <thead className="bg-slate-50/70 sticky top-0 z-10">
      <tr>
        <th className="w-[26%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Candidate</th>
        <th className="w-[20%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Skills</th>
        <th className="w-[11%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
        <th className="w-[14%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
        <th className="w-[9%] px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Apps</th>
        <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
        <th className="w-[10%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered</th>
        <th className="w-[6%] px-6 py-3 text-right pr-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
  );
}