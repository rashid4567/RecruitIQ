import { DataTable } from "@/shared/table/DataTable";
import { EmptyState } from "@/shared/table/EmptyState";
import { TableRow, TableHead } from "@/components/ui/table";
import { Users } from "lucide-react";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";
import type { RecruiterAction } from "./RecruiterActionDialog";
import { RecruiterTableRow } from "./RecruiterTableRow";
import { RecruiterSkeletonRow } from "./RecruiterSkeletonRow";
import { RecruiterCardList } from "./RecruiterCardList";

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
    <>
      {/* Desktop/laptop table — 1024px+ */}
      <div className="hidden lg:block">
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
      </div>

      {/* Mobile/tablet cards — below 1024px */}
      <div className="lg:hidden">
        <RecruiterCardList
          recruiters={recruiters}
          loading={loading}
          pagination={pagination}
          actionLoading={actionLoading}
          onAction={onAction}
          onViewProfile={onViewProfile}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

function RecruiterTableHeader() {
  return (
    <TableRow className="bg-slate-50">
      <TableHead className="w-[26%] px-4 md:px-5 lg:px-6">Recruiter</TableHead>
      <TableHead className="px-4 md:px-5">Verification</TableHead>
      <TableHead className="hidden lg:table-cell px-5">Subscription</TableHead>
      <TableHead className="px-4 md:px-5 text-center">Jobs Posted</TableHead>
      <TableHead className="px-4 text-center">Status</TableHead>
      <TableHead className="hidden lg:table-cell px-5">Joined</TableHead>
      <TableHead className="px-4 md:px-6 text-right md:pr-8">Actions</TableHead>
    </TableRow>
  );
}