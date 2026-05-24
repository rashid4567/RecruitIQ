import { Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ActivityLog } from "@/module/admin/domain/entities/activity-log.enitity";
import { ActivityLogsTableRow } from "./Activitylogstablerow";

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-5 w-5 rounded" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-24 rounded-full" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-10 w-56" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-40" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[90%]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
    </TableCell>
  </TableRow>
);

interface ActivityLogsTableProps {
  paginated: ActivityLog[];
  filtered: ActivityLog[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  totalPages: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  search: string;
}

export function ActivityLogsTable({
  paginated,
  filtered,
  loading,
  pagination,
  totalPages,
  onChangePage,
  onChangeLimit,
  search,
}: ActivityLogsTableProps) {
  return (
    <Card className="border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Activity Stream
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              {filtered.length} events {search && "(filtered)"}
            </CardDescription>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>Show:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onChangeLimit(Number(e.target.value))}
              className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
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
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-44">Time</TableHead>
              <TableHead className="w-40">Level</TableHead>
              <TableHead className="w-72">Actor</TableHead>
              <TableHead className="w-48">Entity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-14 text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Activity className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-lg font-medium">
                      No matching activity logs
                    </p>
                    <p className="text-sm mt-2">
                      Try adjusting your search or refresh the list
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((log, idx) => (
                <ActivityLogsTableRow key={idx} log={log} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
          <div>
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, filtered.length)} of{" "}
            {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page === 1}
              onClick={() => onChangePage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page === 1}
              onClick={() => onChangePage(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-1 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const num =
                  i +
                  Math.max(1, Math.min(pagination.page - 3, totalPages - 6));
                if (num < 1 || num > totalPages) return null;
                return (
                  <Button
                    key={num}
                    variant={num === pagination.page ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 text-sm rounded-md",
                      num === pagination.page &&
                        "bg-indigo-600 hover:bg-indigo-700 text-white",
                    )}
                    onClick={() => onChangePage(num)}
                  >
                    {num}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page >= totalPages}
              onClick={() => onChangePage(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page >= totalPages}
              onClick={() => onChangePage(totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
