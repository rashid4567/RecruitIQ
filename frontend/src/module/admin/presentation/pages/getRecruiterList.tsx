"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Users,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Ban,
  Shield,
  AlertCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Recruiter } from "../../domain/entities/recruiter.entity";
import { getRecruiterListUC, rejectRecruiterUC, verifyRecruiterUC } from "../di/recruiter.di";
import { blockUserUC, unblockUserUC } from "../di/user.di";

type FilterTab = "all" | "pending" | "verified" | "blocked";

export default function RecruiterManagement() {
  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [tab, setTab] = useState<FilterTab>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [confirm, setConfirm] = useState<{
    open: boolean;
    recruiter: Recruiter | null;
    action: "verify" | "reject" | "block" | "unblock" | null;
  }>({ open: false, recruiter: null, action: null });

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: any = { page: pagination.page, limit: pagination.limit };
      if (debouncedSearch) query.search = debouncedSearch;
      if (tab !== "all") {
        if (tab === "pending") query.verificationStatus = "pending";
        if (tab === "verified") query.verificationStatus = "verified";
        if (tab === "blocked") query.isActive = false;
      }

      const res = await getRecruiterListUC.execute(query);
      setRecruiters(res.recruiters ?? []);
      setPagination((p) => ({
        ...p,
        total: res.total ?? 0,
        totalPages: res.total ? Math.ceil(res.total / p.limit) : 1,
      }));
    } catch (err: any) {
      const msg = err?.message || "Failed to load recruiters";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, tab]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  const requestAction = (recruiter: Recruiter, action: typeof confirm.action) => {
    setConfirm({ open: true, recruiter, action });
  };

  const handleConfirmed = async () => {
    if (!confirm.recruiter || !confirm.action) return;

    const { id } = confirm.recruiter;
    const name = confirm.recruiter.companyName || confirm.recruiter.name || "Recruiter";
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      switch (confirm.action) {
        case "verify":
          await verifyRecruiterUC.execute(id);
          toast.success(`${name} has been verified`);
          break;
        case "reject":
          await rejectRecruiterUC.execute(id);
          toast.success(`${name} has been rejected`);
          break;
        case "block":
          await blockUserUC.execute(id);
          toast.success(`${name} has been blocked`);
          break;
        case "unblock":
          await unblockUserUC.execute(id);
          toast.success(`${name} has been unblocked`);
          break;
      }
      await fetchRecruiters();
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
      setConfirm({ open: false, recruiter: null, action: null });
    }
  };

  const getVerificationBadge = (status?: string) => {
    const s = (status || "").toLowerCase();

    if (s === "verified")
      return {
        label: "Verified",
        bg: "bg-emerald-50",
        text: "text-emerald-800",
      };
    if (s === "pending")
      return {
        label: "Pending",
        bg: "bg-amber-50",
        text: "text-amber-800",
      };
    if (s === "rejected")
      return {
        label: "Rejected",
        bg: "bg-rose-50",
        text: "text-rose-800",
      };
    return {
      label: "Unknown",
      bg: "bg-slate-50",
      text: "text-slate-700",
    };
  };

  const getInitials = (str = "") =>
    str
      .split(" ")
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "?";

  const formatDate = (date?: string | Date): string => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const SkeletonRow = () => (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-48 bg-slate-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-6 py-5"><div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" /></td>
      <td className="px-6 py-5"><div className="h-6 w-28 bg-slate-200 rounded-full animate-pulse" /></td>
      <td className="px-6 py-5 text-center"><div className="h-4 w-12 mx-auto bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-6 py-5 text-center"><div className="h-6 w-10 mx-auto bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-6 py-5"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-6 py-5 text-right pr-10"><div className="h-8 w-8 ml-auto bg-slate-200 rounded-lg animate-pulse" /></td>
    </tr>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-6 bg-slate-100 rounded-2xl mb-6 shadow-sm">
        <Users className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">No recruiters found</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md">Try adjusting your search or filters, or check back later.</p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => { setSearch(""); setTab("all"); }}>
          Clear Filters
        </Button>
        <Button size="sm" onClick={fetchRecruiters}>Refresh</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recruiters</h1>
                <p className="text-sm text-slate-500">Review and manage all registered recruiters</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-sm"
                onClick={fetchRecruiters}
                disabled={loading}
              >
                <RefreshCw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button
                size="sm"
                className="h-9 px-3 text-sm bg-indigo-600 hover:bg-indigo-700 gap-1.5"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="sticky top-[4.5rem] z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-sm">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {(["All", "Pending", "Verified", "Blocked"] as const).map((label) => {
                const value = label.toLowerCase() as FilterTab;
                return (
                  <Button
                    key={label}
                    size="sm"
                    variant={tab === value ? "default" : "outline"}
                    className={cn(
                      "h-9 px-4 text-sm font-medium transition-all duration-200",
                      tab === value
                        ? value === "all"
                          ? "bg-slate-800 hover:bg-slate-900"
                          : value === "pending"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : value === "verified"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-rose-600 hover:bg-rose-700"
                        : "border-slate-200 hover:bg-slate-50"
                    )}
                    onClick={() => {
                      setTab(value);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>

            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <Input
                placeholder="Search by name, email, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-400 rounded-lg"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-screen-xl mx-auto">
            {error ? (
              <Card className="border-rose-200 bg-rose-50/50 shadow-sm rounded-xl">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-rose-900 mb-2">Something went wrong</h2>
                  <p className="text-sm text-rose-700 mb-6">{error}</p>
                  <Button size="sm" onClick={fetchRecruiters} className="bg-rose-600 hover:bg-rose-700">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : loading ? (
              <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
                <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
                  <CardTitle className="text-lg font-semibold text-slate-900">Recruiter List</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Loading recruiters...
                  </CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-slate-50/70">
                      <tr>
                        <th className="w-[26%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Recruiter</th>
                        <th className="w-[16%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Verification</th>
                        <th className="w-[14%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subscription</th>
                        <th className="w-[12%] px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Jobs Posted</th>
                        <th className="w-[12%] px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="w-[12%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                        <th className="w-[8%] px-6 py-3 text-right pr-10 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : recruiters.length === 0 ? (
              <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
                <CardContent>
                  <EmptyState />
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
                <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900">Recruiter List</CardTitle>
                      <CardDescription className="text-sm text-slate-600 mt-1">
                        {pagination.total} total recruiters
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span>Rows per page:</span>
                      <select
                        value={pagination.limit}
                        onChange={(e) =>
                          setPagination((p) => ({ ...p, limit: Number(e.target.value), page: 1 }))
                        }
                        className="h-8 px-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
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
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-slate-50/70 sticky top-0 z-10">
                      <tr>
                        <th className="w-[26%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Recruiter</th>
                        <th className="w-[16%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Verification</th>
                        <th className="w-[14%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subscription</th>
                        <th className="w-[12%] px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Jobs Posted</th>
                        <th className="w-[12%] px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="w-[12%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                        <th className="w-[8%] px-6 py-3 text-right pr-10 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {recruiters.map((r) => {
                        const badge = getVerificationBadge(r.verificationStatus);
                        const isActive = r.isActive ?? true;
                        const isActionLoading = actionLoading[r.id] ?? false;

                        return (
                          <tr
                            key={r.id}
                            className="hover:bg-indigo-50/30 transition-colors duration-200 group"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3.5">
                                <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
                                  <AvatarFallback className={cn(
                                    "text-white font-semibold text-sm",
                                    isActive ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-rose-500 to-rose-600"
                                  )}>
                                    {getInitials(r.companyName || r.name || "")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-900 truncate max-w-[200px]">{r.companyName || r.name}</div>
                                  <div className="text-sm text-slate-500 mt-0.5 truncate max-w-[200px]">{r.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <Badge
                                className={cn(
                                  "px-3 py-1 text-xs font-medium rounded-full",
                                  badge.bg,
                                  badge.text
                                )}
                              >
                                {badge.label}
                              </Badge>
                            </td>

                            <td className="px-6 py-5">
                              <Badge variant="secondary" className="px-3 py-1 text-xs bg-slate-100/80 border border-slate-200 text-slate-700 font-medium rounded-full">
                                {r.subscriptionStatus
                                  ? r.subscriptionStatus.charAt(0).toUpperCase() + r.subscriptionStatus.slice(1)
                                  : "—"}
                              </Badge>
                            </td>

                            <td className="px-6 py-5 text-center text-slate-700 font-medium">
                              {r.jobPostsUsed || 0}
                            </td>

                            <td className="px-6 py-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  className={cn(
                                    "h-2.5 w-2.5 rounded-full",
                                    isActive ? "bg-emerald-500" : "bg-rose-500"
                                  )}
                                />
                                <span className={cn(
                                  "text-xs font-medium px-2.5 py-1 rounded-full",
                                  isActive
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-rose-50 text-rose-800"
                                )}>
                                  {isActive ? "Active" : "Blocked"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-slate-600 text-sm">
                              {formatDate(r.joinedDate)}
                            </td>

                            <td className="px-6 py-5 text-right pr-10">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                                  onClick={() => navigate(`/admin/recruiters/${r.id}`)}
                                  disabled={isActionLoading}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                                      disabled={isActionLoading}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-sm border border-slate-200">
                                    {r.verificationStatus === "pending" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => requestAction(r, "verify")}
                                          className="text-emerald-700 hover:bg-emerald-50"
                                        >
                                          <ShieldCheck className="mr-2 h-4 w-4" />
                                          Verify
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => requestAction(r, "reject")}
                                          className="text-rose-700 hover:bg-rose-50"
                                        >
                                          <XCircle className="mr-2 h-4 w-4" />
                                          Reject
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                      </>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => requestAction(r, isActive ? "block" : "unblock")}
                                      className={cn(
                                        isActive ? "text-rose-700 hover:bg-rose-50" : "text-emerald-700 hover:bg-emerald-50"
                                      )}
                                    >
                                      {isActive ? (
                                        <>
                                          <Ban className="mr-2 h-4 w-4" />
                                          Block
                                        </>
                                      ) : (
                                        <>
                                          <Shield className="mr-2 h-4 w-4" />
                                          Unblock
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                    <div>
                      Showing {(pagination.page - 1) * pagination.limit + 1} –{" "}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                        disabled={pagination.page === 1}
                        onClick={() => changePage(1)}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                        disabled={pagination.page === 1}
                        onClick={() => changePage(pagination.page - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNum = i + Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === pagination.page ? "default" : "ghost"}
                              size="sm"
                              className={cn(
                                "h-8 w-8 rounded-md text-sm",
                                pageNum === pagination.page ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-slate-600 hover:bg-slate-200"
                              )}
                              onClick={() => changePage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => changePage(pagination.page + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => changePage(pagination.totalPages)}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>

        {/* Confirmation Dialog */}
        <AlertDialog open={confirm.open} onOpenChange={(open) => !open && setConfirm({ ...confirm, open: false })}>
          <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-slate-900">
                {confirm.action === "verify" ? "Verify Recruiter" :
                 confirm.action === "reject" ? "Reject Recruiter" :
                 confirm.action === "block" ? "Block Recruiter" :
                 "Unblock Recruiter"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-600">
                Are you sure you want to {confirm.action} <span className="font-medium">{confirm.recruiter?.companyName || confirm.recruiter?.name || "this recruiter"}</span>?
                {confirm.action === "verify" ? " This will grant them verified status." :
                 confirm.action === "reject" ? " This will deny their verification request." :
                 confirm.action === "block" ? " This will restrict their access." :
                 " This will restore their access."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmed}
                disabled={Object.values(actionLoading).some(Boolean)}
                className={cn(
                  "h-10 rounded-md",
                  confirm.action === "verify" || confirm.action === "unblock"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                )}
              >
                {Object.values(actionLoading).some(Boolean) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}