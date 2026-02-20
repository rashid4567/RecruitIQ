"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  Download,
  Eye,
  Users,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  X,
  MapPin,
  Briefcase,
  Calendar,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import type { Candidate } from "../../domain/entities/candidates.entity";
import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import { GetCandidateListUC } from "../di/candidate.di";
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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { blockUserUC, unblockUserUC } from "../di/user.di";

type FilterStatusUI = "All" | "Active" | "Blocked";

export default function CandidateManagement() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState<FilterStatusUI>("All");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    candidateId: string;
    candidateName: string;
    action: "block" | "unblock";
  }>({ open: false, candidateId: "", candidateName: "", action: "block" });

  const mapStatusToQuery = (status: FilterStatusUI): boolean | undefined => {
    if (status === "All") return undefined;
    return status === "Active";
  };

  const getExperienceDisplay = (exp: number | { value: number }): string => {
    const experience = typeof exp === "number" ? exp : exp?.value ?? 0;
    return experience <= 0 ? "Entry Level" : experience === 1 ? "1 yr" : `${experience} yrs`;
  };

  const formatDate = (date?: string | Date): string => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (name: string): string => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getSkills = (candidate: Candidate): string[] => {
    return (candidate.skills || []).slice(0, 3);
  };

  const getMoreSkillsCount = (candidate: Candidate): number => {
    return Math.max(0, (candidate.skills?.length || 0) - 3);
  };

  const getLocation = (candidate: Candidate): string => candidate.location || "—";

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: GetCandidatesQuery = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: mapStatusToQuery(filterStatus),
      };

      const response = await GetCandidateListUC.execute(query);

      setCandidates(response.candidates ?? []);
      setPagination((p) => ({
        ...p,
        total: response.total ?? 0,
        totalPages: response.total ? Math.ceil(response.total / p.limit) : 1,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load candidates";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filterStatus]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleToggleStatus = (candidate: Candidate) => {
    setConfirmationDialog({
      open: true,
      candidateId: candidate.userId,
      candidateName: candidate.name,
      action: candidate.isActive() ? "block" : "unblock",
    });
  };

  const confirmStatusToggle = async () => {
    const { candidateId, action, candidateName } = confirmationDialog;
    if (!candidateId) return;

    setActionLoading((prev) => ({ ...prev, [candidateId]: true }));

    try {
      if (action === "block") {
        await blockUserUC.execute(candidateId);
        toast.success(`${candidateName} has been blocked`);
      } else {
        await unblockUserUC.execute(candidateId);
        toast.success(`${candidateName} has been unblocked`);
      }
      await loadCandidates();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setActionLoading((prev) => ({ ...prev, [candidateId]: false }));
      setConfirmationDialog({ open: false, candidateId: "", candidateName: "", action: "block" });
    }
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
      <td className="px-5 py-5">
        <div className="flex gap-1.5">
          <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </td>
      <td className="px-5 py-5"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-5 py-5"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-4 py-5 text-center"><div className="h-6 w-10 mx-auto bg-slate-200 rounded-full animate-pulse" /></td>
      <td className="px-4 py-5 text-center"><div className="h-6 w-24 mx-auto bg-slate-200 rounded-full animate-pulse" /></td>
      <td className="px-5 py-5"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-6 py-5 text-right pr-8"><div className="h-8 w-8 ml-auto bg-slate-200 rounded-lg animate-pulse" /></td>
    </tr>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-6 bg-slate-100 rounded-2xl mb-6 shadow-sm">
        <Users className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">No candidates found</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md">Try adjusting your search or filters, or check back later.</p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setFilterStatus("All"); }}>
          Clear Filters
        </Button>
        <Button size="sm" onClick={loadCandidates}>Refresh</Button>
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
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidates</h1>
                <p className="text-sm text-slate-500">Review and manage all registered candidates</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-sm"
                onClick={loadCandidates}
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
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <Input
                placeholder="Search by name, email, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-400 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["All", "Active", "Blocked"] as FilterStatusUI[]).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={filterStatus === status ? "default" : "outline"}
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-all duration-200",
                    filterStatus === status
                      ? status === "All"
                        ? "bg-slate-800 hover:bg-slate-900"
                        : status === "Active"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-rose-600 hover:bg-rose-700"
                      : "border-slate-200 hover:bg-slate-50"
                  )}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
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
                  <Button size="sm" onClick={loadCandidates} className="bg-rose-600 hover:bg-rose-700">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : loading ? (
              <Card className="overflow-hidden rounded-xl shadow-sm border border-slate-200/70">
                <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200/70">
                  <CardTitle className="text-lg font-semibold text-slate-900">Candidate List</CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Loading candidates...
                  </CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-slate-50/70">
                      <tr>
                        <th className="w-[26%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Candidate</th>
                        <th className="w-[20%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Skills</th>
                        <th className="w-[11%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                        <th className="w-[14%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                        <th className="w-[9%] px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Apps</th>
                        <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="w-[10%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered</th>
                        <th className="w-[6%] px-6 py-3 text-right pr-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : candidates.length === 0 ? (
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
                      <CardTitle className="text-lg font-semibold text-slate-900">Candidate List</CardTitle>
                      <CardDescription className="text-sm text-slate-600 mt-1">
                        {pagination.total} total candidates
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
                        <th className="w-[26%] px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Candidate</th>
                        <th className="w-[20%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Skills</th>
                        <th className="w-[11%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                        <th className="w-[14%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                        <th className="w-[9%] px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Apps</th>
                        <th className="w-[10%] px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="w-[10%] px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered</th>
                        <th className="w-[6%] px-6 py-3 text-right pr-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {candidates.map((candidate) => {
                        const id = candidate.userId;
                        const isActionLoading = actionLoading[id];
                        const isActive = candidate.isActive();

                        return (
                          <tr
                            key={id}
                            className="hover:bg-indigo-50/30 transition-colors duration-200 group"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3.5">
                                <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
                                  <AvatarFallback className={cn(
                                    "text-white font-semibold text-sm",
                                    isActive ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-rose-500 to-rose-600"
                                  )}>
                                    {getInitials(candidate.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-900 truncate max-w-[200px]">{candidate.name}</div>
                                  <div className="text-sm text-slate-500 mt-0.5 truncate max-w-[200px]">{candidate.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex flex-wrap gap-1.5">
                                {getSkills(candidate).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="px-2.5 py-0.5 text-xs bg-slate-100/80 border border-slate-200 text-slate-700 font-medium rounded-full"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {getMoreSkillsCount(candidate) > 0 && (
                                  <Badge variant="outline" className="px-2 py-0.5 text-xs border-slate-300 text-slate-500 rounded-full">
                                    +{getMoreSkillsCount(candidate)}
                                  </Badge>
                                )}
                              </div>
                            </td>

                            <td className="px-5 py-5 text-slate-700 text-sm">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-slate-400" />
                                {getExperienceDisplay(candidate.experience)}
                              </div>
                            </td>

                            <td className="px-5 py-5 text-slate-600 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {getLocation(candidate)}
                              </div>
                            </td>

                            <td className="px-4 py-5 text-center">
                              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm">
                                {/* Replace with real data when available */}
                                {Math.floor(Math.random() * 15) + 3}
                              </Badge>
                            </td>

                            <td className="px-4 py-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  className={cn(
                                    "h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-white",
                                    isActive ? "bg-emerald-500 ring-emerald-300/50" : "bg-rose-500 ring-rose-300/50"
                                  )}
                                />
                                <Badge
                                  className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-full",
                                    isActive
                                      ? "bg-emerald-50 text-emerald-800"
                                      : "bg-rose-50 text-rose-800"
                                  )}
                                >
                                  {isActive ? "Active" : "Blocked"}
                                </Badge>
                                <label
                                  className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2",
                                    isActive ? "bg-emerald-500" : "bg-rose-500",
                                    isActionLoading && "opacity-50 cursor-not-allowed"
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isActive}
                                    onChange={() => handleToggleStatus(candidate)}
                                    disabled={isActionLoading}
                                  />
                                  <span
                                    className={cn(
                                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-black/5 transition duration-200 ease-in-out",
                                      isActive ? "translate-x-5" : "translate-x-1"
                                    )}
                                  />
                                </label>
                              </div>
                            </td>

                            <td className="px-5 py-5 text-slate-600 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                {formatDate(candidate.registeredDate)}
                              </div>
                            </td>

                            <td className="px-6 py-5 text-right pr-8">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
                                onClick={() => navigate(`/admin/candidates/${candidate.userId}`)}
                                disabled={isActionLoading}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
        <AlertDialog open={confirmationDialog.open} onOpenChange={(open) => !open && setConfirmationDialog({ ...confirmationDialog, open: false })}>
          <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-slate-900">
                {confirmationDialog.action === "block" ? "Block Candidate" : "Unblock Candidate"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-600">
                Are you sure you want to {confirmationDialog.action} <span className="font-medium">{confirmationDialog.candidateName}</span>?
                {confirmationDialog.action === "block"
                  ? " This will restrict their access to job notifications."
                  : " This will restore their full access."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmStatusToggle}
                disabled={Object.values(actionLoading).some(Boolean)}
                className={cn(
                  "h-10 rounded-md",
                  confirmationDialog.action === "block"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
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