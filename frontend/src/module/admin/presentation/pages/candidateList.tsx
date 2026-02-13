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
import {  GetCandidateListUC, } from "../di/candidate.di";
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
    <div className="h-22 bg-linear-to-r from-slate-100 to-slate-200/70 rounded-2xl animate-pulse mb-3" />
  );

  const EmptyState = () => (
    <Card className="border-slate-200/50 shadow-lg">
      <CardContent className="p-16 text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-slate-100 flex items-center justify-center">
          <Users className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 mb-3">No candidates found</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Try adjusting your search term or filter settings.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => { setSearchTerm(""); setFilterStatus("All"); }}>
            Clear Filters
          </Button>
          <Button onClick={loadCandidates}>Refresh</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/40 to-purple-50/20 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 px-8 py-5 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-3.5 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidates</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage and review candidate profiles</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 hover:bg-slate-50"
                onClick={loadCandidates}
                disabled={loading}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button className="bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/70 sticky top-19 z-30 px-8 py-5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by name, email, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 pr-14 bg-white border-slate-200 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {(["All", "Active", "Blocked"] as FilterStatusUI[]).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-22 h-11 font-medium transition-all shadow-sm",
                    filterStatus === status
                      ? status === "All"
                        ? "bg-slate-700 hover:bg-slate-800"
                        : status === "Active"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-rose-600 hover:bg-rose-700"
                      : "hover:shadow"
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
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <Card className="border-rose-200 bg-linear-to-br from-rose-50/80 to-rose-100/50">
                <CardContent className="p-16 text-center">
                  <AlertCircle className="h-16 w-16 text-rose-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-rose-900 mb-4">Something went wrong</h2>
                  <p className="text-rose-700 mb-8">{error}</p>
                  <Button size="lg" onClick={loadCandidates} className="bg-rose-600 hover:bg-rose-700">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : loading ? (
              <div className="space-y-4">
                {Array(7).fill(0).map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : candidates.length === 0 ? (
              <EmptyState />
            ) : (
              <Card className="border-slate-200/60 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-linear-to-r from-slate-50 to-indigo-50/40 px-10 py-7 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Candidate List</CardTitle>
                      <CardDescription className="text-slate-600 mt-1.5">
                        Manage candidate profiles • {pagination.total} total records
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-300">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-10 py-5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Candidate</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Skills</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                        <th className="px-8 py-5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Applications</th>
                        <th className="px-10 py-5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered</th>
                        <th className="px-10 py-5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider pr-12">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {candidates.map((candidate) => {
                        const id = candidate.userId;
                        const isActionLoading = actionLoading[id];

                        return (
                          <tr
                            key={id}
                            className="hover:bg-indigo-50/40 transition-colors duration-200 group"
                          >
                            <td className="px-10 py-7">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                                  <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                                    {getInitials(candidate.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 text-base truncate">{candidate.name}</div>
                                  <div className="text-slate-500 text-sm mt-0.5 truncate">{candidate.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="px-8 py-7">
                              <div className="flex flex-wrap gap-2">
                                {getSkills(candidate).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium border border-slate-200"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {getMoreSkillsCount(candidate) > 0 && (
                                  <Badge variant="outline" className="text-xs border-slate-300">
                                    +{getMoreSkillsCount(candidate)}
                                  </Badge>
                                )}
                              </div>
                            </td>

                            <td className="px-8 py-7 text-slate-700 font-medium">
                              <div className="flex items-center gap-2.5">
                                <Briefcase className="h-4.5 w-4.5 text-slate-400" />
                                {getExperienceDisplay(candidate.experience)}
                              </div>
                            </td>

                            <td className="px-8 py-7 text-slate-600">
                              <div className="flex items-center gap-2.5">
                                <MapPin className="h-4.5 w-4.5 text-slate-400" />
                                {getLocation(candidate)}
                              </div>
                            </td>

                            <td className="px-8 py-7 text-center">
                              <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 font-semibold shadow-sm">
                                {/* Replace with real data when available */}
                                {Math.floor(Math.random() * 15) + 3}
                              </Badge>
                            </td>

                            <td className="px-10 py-7">
                              <div className="flex items-center justify-center gap-6">
                                <div className="flex items-center gap-3.5">
                                  <div
                                    className={cn(
                                      "h-3.5 w-3.5 rounded-full ring-2 ring-offset-2 transition-all duration-200",
                                      candidate.isActive()
                                        ? "bg-emerald-500 ring-emerald-200/70"
                                        : "bg-rose-500 ring-rose-200/70"
                                    )}
                                  />
                                  <Badge
                                    className={cn(
                                      "px-4 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-sm",
                                      candidate.isActive()
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                        : "bg-rose-100 text-rose-800 border-rose-200"
                                    )}
                                  >
                                    {candidate.isActive() ? "Active" : "Blocked"}
                                  </Badge>
                                </div>

                                {/* Improved modern toggle */}
                                <label
                                  className={cn(
                                    "relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 ease-out shadow-inner",
                                    candidate.isActive()
                                      ? "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-400/30"
                                      : "bg-linear-to-r from-rose-400 to-rose-500 shadow-rose-400/30",
                                    isActionLoading && "opacity-60 cursor-not-allowed"
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={candidate.isActive()}
                                    onChange={() => handleToggleStatus(candidate)}
                                    disabled={isActionLoading}
                                  />
                                  <span
                                    className={cn(
                                      "pointer-events-none absolute left-1 top-1 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ease-spring",
                                      candidate.isActive() ? "translate-x-8" : "translate-x-0",
                                      "ring-1 ring-black/5"
                                    )}
                                  >
                                    {candidate.isActive() ? (
                                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                                    )}
                                  </span>
                                </label>
                              </div>
                            </td>

                            <td className="px-8 py-7 text-slate-600">
                              <div className="flex items-center gap-2.5">
                                <Calendar className="h-4.5 w-4.5 text-slate-400" />
                                {formatDate(candidate.registeredDate)}
                              </div>
                            </td>

                            <td className="px-10 py-7 text-right pr-12">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-700 transition-all"
                                onClick={() => navigate(`/admin/candidates/${candidate.userId}`)}
                                disabled={isActionLoading}
                              >
                                <Eye className="h-5 w-5" />
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
                  <div className="px-10 py-6 bg-linear-to-r from-slate-50 to-indigo-50/30 border-t border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="text-sm text-slate-600 font-medium">
                        Showing {(pagination.page - 1) * pagination.limit + 1} –{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg"
                          disabled={pagination.page === 1}
                          onClick={() => changePage(1)}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg"
                          disabled={pagination.page === 1}
                          onClick={() => changePage(pagination.page - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-1.5 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={page === pagination.page ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                  "h-8 w-8 rounded-md font-medium",
                                  page === pagination.page && "bg-indigo-600 hover:bg-indigo-700 text-white"
                                )}
                                onClick={() => changePage(page)}
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg"
                          disabled={pagination.page === pagination.totalPages}
                          onClick={() => changePage(pagination.page + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-lg"
                          disabled={pagination.page === pagination.totalPages}
                          onClick={() => changePage(pagination.totalPages)}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>

        {/* Confirmation Dialog – Premium version */}
        <AlertDialog open={confirmationDialog.open}>
          <AlertDialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
            <div className="bg-linear-to-b from-white to-slate-50/90 px-10 pt-10 pb-8">
              <AlertDialogHeader>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-inner">
                  {confirmationDialog.action === "block" ? (
                    <ShieldAlert className="h-10 w-10 text-rose-600" />
                  ) : (
                    <ShieldCheck className="h-10 w-10 text-emerald-600" />
                  )}
                </div>

                <AlertDialogTitle className="text-3xl font-bold text-center text-slate-900 mb-3">
                  {confirmationDialog.action === "block" ? "Block Candidate" : "Unblock Candidate"}
                </AlertDialogTitle>

                <AlertDialogDescription className="text-center text-lg text-slate-600 leading-relaxed">
                  Are you sure you want to{" "}
                  <span className="font-semibold text-slate-900">{confirmationDialog.action}</span>{" "}
                  <span className="font-bold text-indigo-700">{confirmationDialog.candidateName}</span>?
                </AlertDialogDescription>

                <p className="text-sm text-slate-500 text-center mt-4">
                  {confirmationDialog.action === "block"
                    ? "This will prevent the candidate from receiving new job notifications."
                    : "This will restore full access for the candidate."}
                </p>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-10 flex gap-4">
                <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-medium">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={confirmStatusToggle}
                  disabled={Object.values(actionLoading).some(Boolean)}
                  className={cn(
                    "flex-1 h-12 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all",
                    confirmationDialog.action === "block"
                      ? "bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                      : "bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  )}
                >
                  {Object.values(actionLoading).some(Boolean) && (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  )}
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}