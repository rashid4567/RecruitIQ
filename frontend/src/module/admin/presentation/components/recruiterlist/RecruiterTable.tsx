import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecruiterTableRow } from "./RecruiterTableRow";
import { RecruiterSkeletonRow } from "./RecruiterSkeletonRow";

interface RecruiterTableProps {
  recruiters: any[];
  loading: boolean;
  error: string | null;
  pagination: any;
  setPagination: any;
  actionLoading: Record<string, boolean>;
  onAction: (recruiter: any, action: string) => void;
  onViewProfile: (recruiterId: string) => void;  
}

export function RecruiterTable({
  recruiters,
  loading,
  error,
  pagination,
  setPagination,
  actionLoading,
  onAction,
  onViewProfile,
}: RecruiterTableProps) {
  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 px-6 py-5 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Recruiter List</CardTitle>
          <div className="text-sm text-slate-600">
            {pagination.total} total recruiters
          </div>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[28%]">Recruiter</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead className="text-center">Jobs Posted</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => <RecruiterSkeletonRow key={i} />)
            ) : recruiters.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="h-80 text-center">
                  <p className="text-xl text-slate-500">No recruiters found</p>
                </td>
              </TableRow>
            ) : (
              recruiters.map((recruiter) => (
                <RecruiterTableRow
                  key={recruiter._id || recruiter.id}
                  recruiter={recruiter}
                  isActionLoading={actionLoading[recruiter._id || recruiter.id] || false}
                  onAction={onAction}
                  onViewProfile={onViewProfile}       
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination can be added here later */}
    </Card>
  );
}