import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Candidate } from "../../../domain/entities/candidates.entity";
import { CandidateRow } from "./CandidateRow";
import { CandidateSkeleton } from "./CandidateSkeleton";
import { CandidateEmptyState } from "./CandidateEmptyState";
import { Pagination } from "./Pagination";

interface CandidateTableProps {
  candidates: Candidate[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loadingMap: Record<string, boolean>;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  onToggleStatus: (candidateId: string, candidateName: string, action: "block" | "unblock") => void;
  onViewProfile: (candidateId: string) => void;
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
  if (loading) {
    return (
      <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
        <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
          <CardTitle className="text-lg font-semibold text-slate-900">Candidate List</CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Loading candidates...
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <TableHeader />
            <tbody className="divide-y divide-slate-100 bg-white">
              {Array(5).fill(0).map((_, i) => <CandidateSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
        <CardContent className="p-0">
          <CandidateEmptyState onRefresh={onRefresh} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
      <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Candidate List</CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              {pagination.total} total candidates
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>Rows per page:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 px-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <TableHeader />
          <tbody className="divide-y divide-slate-100 bg-white">
            {candidates.map((candidate) => (
              <CandidateRow
                key={candidate.userId}
                candidate={candidate}
                isActionLoading={loadingMap[candidate.userId]}
                onToggleStatus={onToggleStatus}
                onViewProfile={onViewProfile}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}

function TableHeader() {
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