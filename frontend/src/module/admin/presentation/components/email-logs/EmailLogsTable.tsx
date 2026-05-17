import { Mail } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmailLog } from "../../../domain/entities/email-log.entity";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

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

  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden">

      <CardHeader className="bg-slate-50 px-6 py-5 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Email Activity</CardTitle>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span>Rows per page:</span>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className="w-20 h-9">
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
            <TableRow className="bg-slate-50">
              <TableHead className="w-12 pl-6">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
              </TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <EmailLogsSkeletonRow key={i} />)
            ) : logs.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="h-80 text-center py-12">
                  <Mail className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-xl font-medium text-slate-600">No matching emails found</p>
                  <p className="text-slate-500 mt-1">Try changing your search or filters</p>
                </td>
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


      {pagination.totalPages > 1 && (
        <div className="px-6 py-5 bg-slate-50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-medium text-slate-900">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            –{" "}
            <span className="font-medium text-slate-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium text-slate-900">{pagination.total}</span> results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>


            <div className="flex items-center gap-1 px-3">
              {Array.from({ length: Math.min(7, pagination.totalPages) }, (_, i) => {
                const num =
                  i +
                  Math.max(1, Math.min(pagination.page - 3, pagination.totalPages - 6));
                if (num < 1 || num > pagination.totalPages) return null;

                return (
                  <Button
                    key={num}
                    variant={num === pagination.page ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 w-9 rounded-xl",
                      num === pagination.page && "bg-indigo-600 hover:bg-indigo-700 text-white"
                    )}
                    onClick={() => onPageChange(num)}
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
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
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