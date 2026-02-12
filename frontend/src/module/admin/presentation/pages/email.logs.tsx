"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  Filter,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { EmailLog } from "@/module/admin/domain/entities/email-log.entity"; 
import { ApiEmailLogRepository } from "../../infrastructure/repositories/ApiEmailLogRepository";
import { GetEmailLogUseCase } from "../../application/useCases/email-logs/GetEmailLogs.usecase";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function EmailLogsPage() {
  const repo = useMemo(() => new ApiEmailLogRepository(), []);
  const useCase = useMemo(() => new GetEmailLogUseCase(repo), [repo]);

  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters (matching real entity fields)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SENT" | "FAILED">("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "TEST" | "REAL">("ALL");

  // Pagination & bulk selection
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await useCase.execute();
      setLogs(
        data.sort((a, b) => new Date(b.getTimeStamp()).getTime() - new Date(a.getTimeStamp()).getTime())
      );
      setPage(1);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to load email logs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filtering logic matching entity
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.getRecipient().toLowerCase().includes(search.toLowerCase()) ||
      log.getSubject().toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || log.getStatus() === statusFilter;
    const matchesType = typeFilter === "ALL" || log.getType() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalFiltered = filteredLogs.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const paginated = filteredLogs.slice((page - 1) * perPage, page * perPage);

  const allSelected = paginated.length > 0 && selectedIds.length === paginated.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < paginated.length;

  const toggleAll = () => {
    if (allSelected || someSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map((log) => log.getId()));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (log: EmailLog) => {
    const status = log.getStatus();

    if (status === "SENT") {
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Sent
        </Badge>
      );
    }

    // FAILED
    const error = log.getError();
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="gap-1.5 cursor-help">
              <AlertTriangle className="h-3.5 w-3.5" />
              Failed
            </Badge>
          </TooltipTrigger>
          {error && <TooltipContent>{error}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50/70">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Mail className="h-7 w-7 text-indigo-600" />
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Email Logs</h1>
                <p className="text-sm text-gray-600 mt-0.5">Monitor all outgoing system emails (TEST & REAL)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Logs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                disabled={selectedIds.length === 0}
              >
                <Send className="h-4 w-4" />
                Resend Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs(true)}
                disabled={refreshing || loading}
                className="gap-2"
              >
                {refreshing ? <RotateCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
              <div className="text-sm text-gray-500">
                Total: <span className="font-medium">{logs.length}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">

            {/* Filters */}
            <Card className="lg:col-span-3 xl:col-span-2 border shadow-sm h-fit lg:sticky lg:top-8">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-indigo-600" />
                  Filter Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-5 text-sm">

                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Recipient or subject..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger>
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
                  <label className="text-sm font-medium">Type</label>
                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="TEST">Test</SelectItem>
                      <SelectItem value="REAL">Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setTypeFilter("ALL");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <div className="lg:col-span-9 xl:col-span-10">
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  <div className="border-b px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {selectedIds.length} selected
                    </div>

                    <div className="flex items-center gap-4">
                      <Select value={perPage.toString()} onValueChange={(v) => {
                        setPerPage(Number(v));
                        setPage(1);
                      }}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEMS_PER_PAGE_OPTIONS.map(n => (
                            <SelectItem key={n} value={n.toString()}>{n} per page</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="py-20 flex justify-center items-center gap-3 text-gray-500">
                      <RotateCw className="h-6 w-6 animate-spin" />
                      Loading logs...
                    </div>
                  ) : paginated.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                      <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium">No email logs found</h3>
                      <p className="mt-2">Try changing filters or refresh</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10 pl-6">
                                <Checkbox
                                  checked={allSelected || someSelected}
                                  onCheckedChange={toggleAll}
                                  aria-label="Select all visible logs"
                                />
                              </TableHead>
                              <TableHead>ID</TableHead>
                              <TableHead>Recipient</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Sent At</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginated.map((log) => {
                              const id = log.getId() ?? "";
                              const isSelected = selectedIds.includes(id);

                              return (
                                <TableRow key={id} className={isSelected ? "bg-indigo-50/30" : ""}>
                                  <TableCell className="pl-6">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => toggleOne(id)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-mono text-xs text-gray-600">
                                    {id.slice(0, 8)}...
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {log.getRecipient()}
                                  </TableCell>
                                  <TableCell className="max-w-md truncate">
                                    {log.getSubject()}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                      {log.getType()}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600">
                                    {new Date(log.getTimeStamp()).toLocaleString("en-IN", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </TableCell>
                                  <TableCell>{getStatusBadge(log)}</TableCell>
                                  <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1">
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      {log.isFailed() && (
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                                          <RefreshCw className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between text-sm flex-wrap gap-4">
                          <div className="text-gray-600">
                            Showing {(page - 1) * perPage + 1}–
                            {Math.min(page * perPage, totalFiltered)} of {totalFiltered}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={page === 1}
                              onClick={() => setPage(p => p - 1)}
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Prev
                            </Button>

                            <span className="px-3 py-1 bg-gray-100 rounded font-medium">
                              Page {page} of {totalPages}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={page === totalPages}
                              onClick={() => setPage(p => p + 1)}
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}