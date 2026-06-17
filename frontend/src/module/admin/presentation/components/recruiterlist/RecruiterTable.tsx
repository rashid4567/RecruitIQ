import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { RecruiterTableRow } from "./RecruiterTableRow";
import { RecruiterSkeletonRow } from "./RecruiterSkeletonRow";
import type { Recruiter } from "../../../domain/entities/recruiter.entity";
import type { RecruiterAction } from "./RecruiterActionDialog";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RecruiterTableProps {
  recruiters: Recruiter[];
  loading: boolean;
  pagination: Pagination;
  actionLoading: Record<string, boolean>;
  onAction: (recruiter: Recruiter, action: RecruiterAction) => void;
  onViewProfile: (recruiterId: string) => void;
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
  const { total, page, limit, totalPages } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 px-6 py-5 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Recruiter List
          </CardTitle>
          <div className="text-sm text-slate-600">{total} total recruiters</div>
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
                  key={recruiter.id}
                  recruiter={recruiter}
                  isActionLoading={actionLoading[recruiter.id] || false}
                  onAction={onAction}
                  onViewProfile={onViewProfile}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
        
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">{startItem}</span>
            {" – "}
            <span className="font-medium text-slate-700">{endItem}</span>
            {" of "}
            <span className="font-medium text-slate-700">{total}</span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-sm text-slate-400 select-none"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 text-sm"
                  onClick={() => onPageChange(p as number)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
