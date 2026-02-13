"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  RotateCw,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const getValue = (obj: any, method: string, field: string) =>
    typeof obj?.[method] === "function" ? obj[method]() : obj?.[field];

  const getUserName = (log: any) => {
    const meta = getValue(log, "getMetadata", "metadata") || {};
    return meta.fullName || meta.userName || meta.name || getValue(log, "getUserId", "userId") || "—";
  };

  const getRole = (log: any) => {
    const meta = getValue(log, "getMetadata", "metadata") || {};
    return meta.role || getValue(log, "getRole", "role") || "system";
  };

  const getUserIdSafe = (log: any) => getValue(log, "getUserId", "userId") || "";

  const getDescription = (log: any) => {
    const user = getUserName(log);
    const action = (getValue(log, "getAction", "action") || "").toUpperCase();
    const meta = getValue(log, "getMetadata", "metadata") || {};

    const templates: Record<string, string> = {
      JOB_POSTED: `${user} posted job • ${meta.jobTitle || meta.title || "—"}`,
      PROFILE_UPDATE: `${user} updated profile`,
      USER_CREATED: `${user} created account`,
      INTERVIEW_SCHEDULED: `${user} scheduled interview`,
      SYSTEM_ERROR: `System error in ${meta.module || "core"}`,
    };

    return templates[action] || `${user} • ${action.replace(/_/g, " ").toLowerCase()}`;
  };

  const getSeverity = (action: string = ""): "info" | "success" | "warning" | "error" => {
    const a = action.toUpperCase();
    if (a.includes("ERROR") || a.includes("CRITICAL")) return "error";
    if (a.includes("POSTED") || a.includes("CREATED") || a.includes("SUCCESS")) return "success";
    if (a.includes("UPDATE") || a.includes("SCHEDULED")) return "info";
    return "info";
  };

  const severityConfig = {
    error:   { color: "red",   icon: AlertCircle, row: "bg-red-50/70 border-l-4 border-red-400/60" },
    success: { color: "emerald", icon: CheckCircle, row: "bg-emerald-50/60 border-l-4 border-emerald-400/60" },
    info:    { color: "blue",   icon: Activity,     row: "bg-blue-50/50 border-l-4 border-blue-400/50" },
    warning: { color: "amber",  icon: AlertCircle,  row: "bg-amber-50/60 border-l-4 border-amber-400/60" },
  };

  const fetchLogs = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const data = await useCase.execute();
      const sorted = [...data].sort((a, b) =>
        new Date(getValue(b, "getTimestamp", "timestamp")).getTime() -
        new Date(getValue(a, "getTimestamp", "timestamp")).getTime()
      );
      setLogs(sorted);
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(log =>
    getDescription(log).toLowerCase().includes(search.toLowerCase()) ||
    getUserName(log).toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleViewProfile = (userId: string, role?: string) => {
    if (!userId) return;
    const lowerRole = (role || "").toLowerCase();
    if (lowerRole.includes("candidate")) {
      navigate(`/admin/candidates/${userId}`);
    } else if (lowerRole.includes("recruiter") || lowerRole.includes("admin")) {
      navigate(`/admin/recruiters/${userId}`);
    } else {
      console.warn("Cannot navigate — unknown role", role);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-40" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                  <p className="text-muted-foreground">System events, user actions and important changes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => fetchLogs(true)} disabled={refreshing}>
                  {refreshing ? (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total" value={logs.length} />
              <StatCard title="Errors" value={logs.filter(l => getSeverity(getValue(l, "getAction", "action")).includes("error")).length} color="text-destructive" />
              <StatCard title="Today" value={logs.filter(l => new Date(getValue(l, "getTimestamp", "timestamp")).toDateString() === new Date().toDateString()).length} />
              <StatCard title="Last user" value={logs[0] ? getUserName(logs[0]) : "—"} truncate />
            </div>

            {/* Search & quick filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search user or action…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div className="flex flex-wrap gap-2">
                {["Error", "Job", "Update", "Interview"].map(t => (
                  <Badge key={t} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Main Table */}
            <Card className="border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-9"></TableHead>
                      <TableHead className="w-44">When</TableHead>
                      <TableHead className="w-44">Type</TableHead>
                      <TableHead className="w-56">User</TableHead>
                      <TableHead className="w-44">Entity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((log, i) => {
                      const action = getValue(log, "getAction", "action") || "";
                      const severity = getSeverity(action);
                      const cfg = severityConfig[severity];
                      const Icon = cfg.icon;

                      return (
                        <TableRow
                          key={i}
                          className={cn(
                            "group border-b last:border-0 transition-colors",
                            cfg.row
                          )}
                        >
                          <TableCell>
                            <Checkbox className="translate-y-[2px]" />
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(getValue(log, "getTimestamp", "timestamp")).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 text-${cfg.color}-600`} />
                              <span className="text-xs font-medium capitalize">{severity}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="flex items-center gap-2.5 hover:underline text-left"
                                  onClick={() => handleViewProfile(getUserIdSafe(log), getRole(log))}
                                >
                                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                                    {getUserName(log)?.[0]?.toUpperCase() || "?"}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium truncate max-w-[180px]">
                                      {getUserName(log)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{getRole(log)}</div>
                                  </div>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Click to view profile
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>

                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1.5">
                              {action.toUpperCase().includes("JOB") ? (
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              <span className="truncate max-w-[140px]">
                                {getValue(log, "getEntity", "entity") || "—"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground pr-4">
                            <div className="line-clamp-2 max-w-[420px]">
                              {getDescription(log)}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-48 p-1.5">
                                <div className="grid gap-0.5">
                                  <button
                                    className="flex px-3 py-2 text-sm rounded-md hover:bg-accent text-left"
                                    onClick={() => handleViewProfile(getUserIdSafe(log), getRole(log))}
                                  >
                                    View profile
                                  </button>
                                  <button className="flex px-3 py-2 text-sm rounded-md hover:bg-accent text-left">
                                    Copy log ID
                                  </button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t bg-card text-sm text-muted-foreground">
                <div>
                  Showing {paginated.length} of {filtered.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-20 text-center font-medium">
                    {page} / {totalPages || 1}
                  </span>
                  <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function StatCard({ title, value, color = "", truncate = false }: { title: string; value: number | string; color?: string; truncate?: boolean }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", color, truncate && "truncate")}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}