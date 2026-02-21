import {
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EmailLog } from "../../../domain/entities/email-log.entity";
import { EmailLogsTableRow } from "./EmailLogsTableRow";
import { EmailLogsSkeletonRow } from "./EmailLogsSkeletonRow";

interface EmailLogsTableProps {
  logs: EmailLog[];
  loading: boolean;
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  perPageOptions: number[];
}

export function EmailLogsTable({
  logs,
  loading,
  selectedIds,
  onSelectAll,
  onSelectOne,
  pagination,
  onPageChange,
  onLimitChange,
  perPageOptions,
}: EmailLogsTableProps) {
  const allSelected = logs.length > 0 && selectedIds.length === logs.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <Card className="border-slate-200/70 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Email Activity
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-xs bg-slate-200 text-slate-700"
            >
              {pagination.total} total
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>Rows per page:</span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="w-12 pl-6">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-44">Sent At</TableHead>
              <TableHead className="w-72">Recipient</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-28 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <EmailLogsSkeletonRow key={i} />)
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-64 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <Mail className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-lg font-medium">
                      No email logs match your filters
                    </p>
                    <p className="text-sm mt-2">
                      Try adjusting filters or refresh the list
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <EmailLogsTableRow
                  key={log.getId()}
                  log={log}
                  isSelected={selectedIds.includes(log.getId() ?? "")}
                  onSelect={onSelectOne}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
          <div>
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-1 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
              {Array.from(
                { length: Math.min(7, pagination.totalPages) },
                (_, i) => {
                  const num =
                    i +
                    Math.max(
                      1,
                      Math.min(pagination.page - 3, pagination.totalPages - 6),
                    );
                  if (num < 1 || num > pagination.totalPages) return null;
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
                      onClick={() => onPageChange(num)}
                    >
                      {num}
                    </Button>
                  );
                },
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.totalPages)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
