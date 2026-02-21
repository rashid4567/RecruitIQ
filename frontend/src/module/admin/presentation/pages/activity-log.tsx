"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Info,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { ApiActivityLogRepository } from "../../infrastructure/repositories/Api-Activity.log.repository";
import { GetActivityLogUseCase } from "../../application/useCases/activityLogs/GetActivity-logs.usecase";

export default function ActivityLogsPage() {
  const repo = useMemo(() => new ApiActivityLogRepository(), []);
  const useCase = useMemo(() => new GetActivityLogUseCase(repo), [repo]);
  const navigate = useNavigate();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,        
    total: 0,
  });

  const getValue = (obj: any, method: string, field: string) =>
    typeof obj?.[method] === "function" ? obj[method]() : obj?.[field] ?? null;

  const getUserName = (log: any) => {
    const meta = getValue(log, "getMetadata", "metadata") || {};
    return meta.fullName || meta.userName || meta.name || getValue(log, "getUserId", "userId") || "System";
  };

  const getRole = (log: any) => {
    const meta = getValue(log, "getMetadata", "metadata") || {};
    const role = meta.role || getValue(log, "getRole", "role") || "system";
    return role.toLowerCase();
  };

  const getUserIdSafe = (log: any) => getValue(log, "getUserId", "userId") || "";

  const getDescription = (log: any) => {
    const user = getUserName(log);
    const action = (getValue(log, "getAction", "action") || "").toUpperCase();
    const meta = getValue(log, "getMetadata", "metadata") || {};

    const templates: Record<string, string> = {
      JOB_POSTED:       `${user} created job posting • ${meta.jobTitle || meta.title || "—"}`,
      PROFILE_UPDATE:   `${user} updated profile information`,
      USER_CREATED:     `${user} registered new account`,
      INTERVIEW_SCHEDULED: `${user} scheduled interview session`,
      SYSTEM_ERROR:     `Critical error in ${meta.module || "core system"}`,
      LOGIN_SUCCESS:    `${user} signed in`,
      LOGIN_FAILED:     `${user} login attempt failed`,
      LOGOUT:           `${user} signed out`,
      PASSWORD_RESET:   `${user} requested password reset`,
    };

    return templates[action] || `${user} • ${action.replace(/_/g, " ").toLowerCase()}`;
  };

  const getSeverity = (action: string = ""): "success" | "info" | "warning" | "error" => {
    const a = action.toUpperCase();
    if (a.includes("ERROR") || a.includes("FAIL") || a.includes("CRITICAL")) return "error";
    if (a.includes("CREATED") || a.includes("POSTED") || a.includes("SUCCESS")) return "success";
    if (a.includes("UPDATE") || a.includes("SCHEDULED") || a.includes("LOGIN") || a.includes("LOGOUT") || a.includes("RESET")) return "info";
    return "info";
  };

  const severityConfig = {
    error:   { bg: "bg-rose-50/65",   border: "border-l-4 border-rose-500/70",   icon: AlertCircle, color: "text-rose-700",   badge: "bg-rose-100 text-rose-800" },
    success: { bg: "bg-emerald-50/65", border: "border-l-4 border-emerald-500/70", icon: CheckCircle, color: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
    info:    { bg: "bg-blue-50/60",    border: "border-l-4 border-blue-500/60",    icon: Info,        color: "text-blue-700",    badge: "bg-blue-100 text-blue-800" },
    warning: { bg: "bg-amber-50/65",   border: "border-l-4 border-amber-500/70",   icon: AlertCircle, color: "text-amber-700",   badge: "bg-amber-100 text-amber-800" },
  };

  const fetchLogs = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const data = await useCase.execute();
      const sorted = [...data].sort((a, b) =>
        new Date(getValue(b, "getTimestamp", "timestamp") || 0).getTime() -
        new Date(getValue(a, "getTimestamp", "timestamp") || 0).getTime()
      );
      setLogs(sorted);
      setPagination(p => ({ ...p, page: 1, total: sorted.length }));
    } catch (err: any) {
      setError(err?.message || "Could not load activity logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [useCase]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filtered = logs.filter(log =>
    getDescription(log).toLowerCase().includes(search.toLowerCase()) ||
    getUserName(log).toLowerCase().includes(search.toLowerCase()) ||
    getRole(log).toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const totalPages = Math.ceil(filtered.length / pagination.limit);

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination(p => ({ ...p, page: newPage }));
  };

  const formatRelativeTime = (timestamp?: string | number) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-5 rounded" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-10 w-56" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[90%]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
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
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activity Logs</h1>
                  <p className="text-sm text-slate-500">Real-time system & user activity monitoring</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3"
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
                <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm" disabled>
                  Export
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto space-y-6">

              {error && (
                <Card className="border-rose-200/70 bg-rose-50/40 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-rose-900 mb-2">Failed to load logs</h2>
                    <p className="text-rose-700 mb-6">{error}</p>
                    <Button onClick={() => fetchLogs()} className="bg-rose-600 hover:bg-rose-700">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!error && (
                <>
                  {/* Stats */}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Total Events</p>
                            <p className="text-3xl font-bold mt-1.5">{logs.length}</p>
                          </div>
                          <Activity className="h-8 w-8 text-indigo-500/70" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Errors</p>
                            <p className="text-3xl font-bold mt-1.5 text-rose-600">
                              {logs.filter(l => getSeverity(getValue(l, "getAction", "action")) === "error").length}
                            </p>
                          </div>
                          <AlertCircle className="h-8 w-8 text-rose-500/70" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Today</p>
                            <p className="text-3xl font-bold mt-1.5">
                              {logs.filter(l => {
                                const d = new Date(getValue(l, "getTimestamp", "timestamp") || 0);
                                return d.toDateString() === new Date().toDateString();
                              }).length}
                            </p>
                          </div>
                          <Clock className="h-8 w-8 text-blue-500/70" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm text-slate-500 font-medium">Most Recent</p>
                            <p className="text-xl font-semibold mt-1.5 truncate">
                              {logs[0] ? getUserName(logs[0]) : "—"}
                            </p>
                          </div>
                          <User className="h-8 w-8 text-slate-500/70 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Search */}
                  <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="Search users, actions, descriptions..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="h-11 pl-11 pr-12 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400 rounded-xl"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Table Card */}
                  <Card className="border-slate-200/60 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">Activity Stream</CardTitle>
                          <CardDescription className="text-sm text-slate-600 mt-1">
                            {filtered.length} events {search && `(filtered)`}
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Show:</span>
                          <select
                            value={pagination.limit}
                            onChange={e => setPagination(p => ({ ...p, limit: Number(e.target.value), page: 1 }))}
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
                            Array(10).fill(0).map((_, i) => <SkeletonRow key={i} />)
                          ) : paginated.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                  <Activity className="h-12 w-12 text-slate-300 mb-4" />
                                  <p className="text-lg font-medium">No matching activity logs</p>
                                  <p className="text-sm mt-2">Try adjusting your search or refresh the list</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginated.map((log, idx) => {
                              const action = getValue(log, "getAction", "action") || "";
                              const severity = getSeverity(action);
                              const cfg = severityConfig[severity];
                              const Icon = cfg.icon;

                              return (
                                <TableRow
                                  key={idx}
                                  className={cn(
                                    "group border-b last:border-0 transition-colors hover:bg-slate-50/80",
                                    cfg.bg,
                                    cfg.border
                                  )}
                                >
                                  <TableCell>
                                    <Checkbox className="translate-y-0.5" />
                                  </TableCell>

                                  <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span>{formatRelativeTime(getValue(log, "getTimestamp", "timestamp"))}</span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {new Date(getValue(log, "getTimestamp", "timestamp") || 0).toLocaleString()}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TableCell>

                                  <TableCell>
                                    <Badge className={cn("px-3 py-1 text-xs font-medium", cfg.badge)}>
                                      {severity}
                                    </Badge>
                                  </TableCell>

                                  <TableCell>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          className="flex items-center gap-3 hover:underline w-full text-left"
                                          onClick={() => {
                                            const uid = getUserIdSafe(log);
                                            if (!uid) return;
                                            const role = getRole(log);
                                            if (role.includes("candidate"))      navigate(`/admin/candidates/${uid}`);
                                            else if (role.includes("recruiter") || role.includes("admin"))
                                              navigate(`/admin/recruiters/${uid}`);
                                          }}
                                        >
                                          <div className={cn(
                                            "h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm",
                                            severity === "error" ? "bg-rose-600" : "bg-indigo-600"
                                          )}>
                                            {getUserName(log)?.slice(0, 2).toUpperCase() || "?"}
                                          </div>
                                          <div className="min-w-0">
                                            <div className="font-medium truncate max-w-[260px]">
                                              {getUserName(log)}
                                            </div>
                                            <div className="text-xs text-slate-500 capitalize mt-0.5">{getRole(log)}</div>
                                          </div>
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">View profile</TooltipContent>
                                    </Tooltip>
                                  </TableCell>

                                  <TableCell className="text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                      {action.toUpperCase().includes("JOB") ? (
                                        <Briefcase className="h-4 w-4 text-slate-400" />
                                      ) : (
                                        <User className="h-4 w-4 text-slate-400" />
                                      )}
                                      <span className="truncate max-w-[180px]">
                                        {getValue(log, "getEntity", "entity") || "—"}
                                      </span>
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-sm text-slate-700">
                                    <div className="line-clamp-2 max-w-[600px]">
                                      {getDescription(log)}
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-right pr-6">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent align="end" className="w-52 p-1.5 rounded-xl shadow-lg">
                                        <div className="space-y-0.5">
                                          <button className="w-full text-left px-4 py-2.5 text-sm rounded-lg hover:bg-slate-100">
                                            View full details
                                          </button>
                                          <button className="w-full text-left px-4 py-2.5 text-sm rounded-lg hover:bg-slate-100">
                                            Copy event ID
                                          </button>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
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
                      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                        <div>
                          Showing {(pagination.page - 1) * pagination.limit + 1}–
                          {Math.min(pagination.page * pagination.limit, filtered.length)} of {filtered.length}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-9 w-9" disabled={pagination.page === 1} onClick={() => changePage(1)}>
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-9 w-9" disabled={pagination.page === 1} onClick={() => changePage(pagination.page - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          <div className="flex gap-1 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                              const num = i + Math.max(1, Math.min(pagination.page - 3, totalPages - 6));
                              if (num < 1 || num > totalPages) return null;
                              return (
                                <Button
                                  key={num}
                                  variant={num === pagination.page ? "default" : "ghost"}
                                  size="sm"
                                  className={cn(
                                    "h-8 w-8 p-0 text-sm rounded-md",
                                    num === pagination.page && "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  )}
                                  onClick={() => changePage(num)}
                                >
                                  {num}
                                </Button>
                              );
                            })}
                          </div>

                          <Button variant="outline" size="icon" className="h-9 w-9" disabled={pagination.page >= totalPages} onClick={() => changePage(pagination.page + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-9 w-9" disabled={pagination.page >= totalPages} onClick={() => changePage(totalPages)}>
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}