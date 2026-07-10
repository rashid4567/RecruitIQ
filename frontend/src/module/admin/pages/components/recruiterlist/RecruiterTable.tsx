import { DataTable } from "@/shared/table/DataTable";
import { EmptyState } from "@/shared/table/EmptyState";
import { TableRow, TableHead } from "@/components/ui/table";
import { Users } from "lucide-react";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";
import type { RecruiterAction } from "./RecruiterActionDialog";
import { RecruiterTableRow } from "./RecruiterTableRow";
import { RecruiterSkeletonRow } from "./RecruiterSkeletonRow";

interface RecruiterTableProps {
  recruiters: RecruiterProfile[];
  loading: boolean;
  pagination: { total: number; page: number; limit: number; totalPages: number };
  actionLoading: Record<string, boolean>;
  onAction: (recruiter: RecruiterProfile, action: RecruiterAction) => void;
  onViewProfile: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function RecruiterTable({
  recruiters,
  loading,
  pagination,
  actionLoading,
  onAction,
  onViewProfile,
  onPageChange,
}: RecruiterTableProps) {
  return (
    <DataTable
      title="Recruiter List"
      description={`${pagination.total} total recruiters`}
      loading={loading}
      isEmpty={recruiters.length === 0}
      skeletonRows={Array(6)
        .fill(0)
        .map((_, i) => (
          <RecruiterSkeletonRow key={i} />
        ))}
      emptyState={
        <EmptyState
          icon={<Users className="h-12 w-12 text-slate-400" />}
          title="No recruiters found"
        />
      }
      header={
        <thead className="bg-slate-50/70 sticky top-0 z-10">
          <RecruiterTableHeader />
        </thead>
      }
      pagination={pagination}
      onPageChange={onPageChange}
    >
      {recruiters.map((recruiter) => (
        <RecruiterTableRow
          key={recruiter.id}
          recruiter={recruiter}
          isActionLoading={actionLoading[recruiter.id] || false}
          onAction={onAction}
          onViewProfile={onViewProfile}
        />
      ))}
    </DataTable>
  );
}

function RecruiterTableHeader() {
  return (
    <TableRow className="bg-slate-50">
      <TableHead className="w-[28%]">Recruiter</TableHead>
      <TableHead>Verification</TableHead>
      <TableHead>Subscription</TableHead>
      <TableHead className="text-center">Jobs Posted</TableHead>
      <TableHead className="text-center">Status</TableHead>
      <TableHead>Joined</TableHead>
      <TableHead className="text-right pr-8">Actions</TableHead>
    </TableRow>
  );
}