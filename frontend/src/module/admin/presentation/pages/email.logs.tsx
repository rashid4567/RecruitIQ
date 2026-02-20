"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Mail,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  X,
  Filter,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Loader2,
  RotateCw,
} from "lucide-react";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import type { EmailLog } from "@/module/admin/domain/entities/email-log.entity";
import { ApiEmailLogRepository } from "../../infrastructure/repositories/ApiEmailLogRepository";
import { GetEmailLogUseCase } from "../../application/useCases/email-logs/GetEmailLogs.usecase";
import { cn } from "@/lib/utils";

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function EmailLogsPage() {
  const repo = useMemo(() => new ApiEmailLogRepository(), []);
  const useCase = useMemo(() => new GetEmailLogUseCase(repo), [repo]);

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SENT" | "FAILED">(
    "ALL",
  );
  const [typeFilter, setTypeFilter] = useState<"ALL" | "TEST" | "REAL">("ALL");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchLogs = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      try {
        const data = await useCase.execute();
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.getTimeStamp()).getTime() -
            new Date(a.getTimeStamp()).getTime(),
        );
        setLogs(sorted);
        setPagination((p) => ({ ...p, page: 1, total: sorted.length }));
        setSelectedIds([]);
      } catch (err: any) {
        const msg = err?.message || "Failed to load email logs";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [useCase],
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      log.getRecipient().toLowerCase().includes(searchLower) ||
      log.getSubject().toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" || log.getStatus() === statusFilter;
    const matchesType = typeFilter === "ALL" || log.getType() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const paginated = filteredLogs.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit,
  );

  const totalPages = Math.ceil(filteredLogs.length / pagination.limit);

  const allSelectedOnPage =
    paginated.length > 0 && selectedIds.length === paginated.length;
  const someSelected = selectedIds.length > 0;

  const toggleAllOnPage = () => {
    if (allSelectedOnPage || someSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map((log) => log.getId()));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const formatRelativeTime = (ts: string | number) => {
    const date = new Date(ts);
    const diff = Date.now() - date.getTime();

    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} h ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const getStatusBadge = (log: EmailLog) => {
    const status = log.getStatus();
    const isFailed = status === "FAILED";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm",
                isFailed
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200",
              )}
            >
              {isFailed ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {status}
            </Badge>
          </TooltipTrigger>
          {isFailed && log.getError() && (
            <TooltipContent className="max-w-xs">
              <p className="font-medium">Error:</p>
              <p className="text-xs text-rose-800 mt-1">{log.getError()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-8 bg-slate-200 rounded-lg ml-auto animate-pulse" />
      </TableCell>
    </TableRow>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Email Logs
                  </h1>
                  <p className="text-sm text-slate-500">
                    Track all outgoing system & test emails
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchLogs(true)}
                  disabled={refreshing || loading}
                >
                  {refreshing || loading ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1.5 h-4 w-4" />
                  )}
                  Refresh
                </Button>

                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm"
                  disabled
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              {error && (
                <Card className="border-rose-200/70 bg-rose-50/40 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                    <p className="text-rose-800 font-medium">{error}</p>
                    <Button
                      size="sm"
                      className="mt-4 bg-rose-600 hover:bg-rose-700"
                      onClick={() => fetchLogs()}
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!error && (
                <div className="grid lg:grid-cols-12 gap-7">
                  {/* Filters Sidebar */}
                  <div className="lg:col-span-3 xl:col-span-2">
                    <Card className="border-slate-200/70 shadow-sm sticky top-20">
                      <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Filter className="h-5 w-5 text-indigo-600" />
                          Filters
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-6 text-sm">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Search
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                            <Input
                              placeholder="Recipient or subject..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="h-10 pl-11 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 rounded-lg"
                            />
                            {search && (
                              <button
                                onClick={() => setSearch("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Status
                          </label>
                          <Select
                            value={statusFilter}
                            onValueChange={(v) => {
                              setStatusFilter(v as any);
                              setPagination((p) => ({ ...p, page: 1 }));
                            }}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ALL">All</SelectItem>
                              <SelectItem value="SENT">Sent</SelectItem>
                              <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Type
                          </label>
                          <Select
                            value={typeFilter}
                            onValueChange={(v) => {
                              setTypeFilter(v as any);
                              setPagination((p) => ({ ...p, page: 1 }));
                            }}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ALL">All</SelectItem>
                              <SelectItem value="TEST">Test</SelectItem>
                              <SelectItem value="REAL">Real</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-10 mt-2"
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                            setTypeFilter("ALL");
                            setPagination((p) => ({ ...p, page: 1 }));
                          }}
                        >
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Table Area */}
                  <div className="lg:col-span-9 xl:col-span-10 space-y-6">
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
                              {filteredLogs.length} total
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>Rows per page:</span>
                            <Select
                              value={pagination.limit.toString()}
                              onValueChange={(v) =>
                                setPagination((p) => ({
                                  ...p,
                                  limit: Number(v),
                                  page: 1,
                                }))
                              }
                            >
                              <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PER_PAGE_OPTIONS.map((n) => (
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
                                  checked={
                                    selectedIds.length === 0
                                      ? false
                                      : selectedIds.length === paginated.length
                                        ? true
                                        : "indeterminate"
                                  }
                                  onCheckedChange={toggleAllOnPage}
                                />
                              </TableHead>
                              <TableHead className="w-44">Sent At</TableHead>
                              <TableHead className="w-72">Recipient</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead className="w-28">Type</TableHead>
                              <TableHead className="w-32">Status</TableHead>
                              <TableHead className="w-28 text-right pr-8">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              Array(8)
                                .fill(0)
                                .map((_, i) => <SkeletonRow key={i} />)
                            ) : paginated.length === 0 ? (
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
                              paginated.map((log) => {
                                const id = log.getId() ?? "";
                                const isSelected = selectedIds.includes(id);
                                const failed = log.getStatus() === "FAILED";

                                return (
                                  <TableRow
                                    key={id}
                                    className={cn(
                                      "hover:bg-slate-50/80 transition-colors border-b last:border-0",
                                      isSelected && "bg-indigo-50/40",
                                      failed && "bg-rose-50/30",
                                    )}
                                  >
                                    <TableCell className="pl-6">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleOne(id)}
                                      />
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span>
                                            {formatRelativeTime(
                                              log.getTimeStamp(),
                                            )}
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {new Date(
                                            log.getTimeStamp(),
                                          ).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                          })}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TableCell>

                                    <TableCell className="font-medium text-slate-900">
                                      {log.getRecipient()}
                                    </TableCell>

                                    <TableCell className="max-w-md truncate text-slate-700">
                                      {log.getSubject()}
                                    </TableCell>

                                    <TableCell>
                                      <Badge
                                        variant="secondary"
                                        className="px-3 py-1 text-xs bg-slate-100/80 border border-slate-200 rounded-full"
                                      >
                                        {log.getType()}
                                      </Badge>
                                    </TableCell>

                                    <TableCell>{getStatusBadge(log)}</TableCell>

                                    <TableCell className="text-right pr-8">
                                      <div className="flex justify-end gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-slate-600 hover:text-indigo-700"
                                        >
                                          <Eye className="h-4.5 w-4.5" />
                                        </Button>
                                        {failed && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700"
                                          >
                                            <RotateCw className="h-4.5 w-4.5" />
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
                          <div>
                            Showing{" "}
                            {(pagination.page - 1) * pagination.limit + 1}–
                            {Math.min(
                              pagination.page * pagination.limit,
                              filteredLogs.length,
                            )}{" "}
                            of {filteredLogs.length}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              disabled={pagination.page === 1}
                              onClick={() => changePage(1)}
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              disabled={pagination.page === 1}
                              onClick={() => changePage(pagination.page - 1)}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex gap-1 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                              {Array.from(
                                { length: Math.min(7, totalPages) },
                                (_, i) => {
                                  const num =
                                    i +
                                    Math.max(
                                      1,
                                      Math.min(
                                        pagination.page - 3,
                                        totalPages - 6,
                                      ),
                                    );
                                  if (num < 1 || num > totalPages) return null;
                                  return (
                                    <Button
                                      key={num}
                                      variant={
                                        num === pagination.page
                                          ? "default"
                                          : "ghost"
                                      }
                                      size="sm"
                                      className={cn(
                                        "h-8 w-8 p-0 text-sm rounded-md",
                                        num === pagination.page &&
                                          "bg-indigo-600 hover:bg-indigo-700 text-white",
                                      )}
                                      onClick={() => changePage(num)}
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
                              disabled={pagination.page >= totalPages}
                              onClick={() => changePage(pagination.page + 1)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              disabled={pagination.page >= totalPages}
                              onClick={() => changePage(totalPages)}
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
