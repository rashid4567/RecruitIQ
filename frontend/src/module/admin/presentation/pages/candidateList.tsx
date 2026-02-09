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
  Loader2,
  X,
  MapPin,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  blockCandidateUC,
  GetCandidateListUC,
  unblockCandidateUC,
} from "../di/candidate.di";
import type { Candidate } from "../../domain/entities/candidates.entity";
import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";


type FilterStatusUI = "All" | "Active" | "Blocked";

const statusColors = {
  Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Blocked: "bg-rose-100 text-rose-800 border-rose-200",
};


export default function CandidateManagement() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState<FilterStatusUI>("All");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    candidate: Candidate | null;
    action: "block" | "unblock" | null;
  }>({ open: false, candidate: null, action: null });

  /* ---------------------------------- */
  /* Helpers                            */
  /* ---------------------------------- */
  const mapStatusToQuery = (status: FilterStatusUI): boolean | undefined => {
    if (status === "All") return undefined;
    return status === "Active";
  };

  const getExperienceDisplay = (exp: number) =>
    exp <= 0 ? "Entry Level" : exp === 1 ? "1 yr" : `${exp} yrs`;

  const formatDate = (date?: string) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  // Mock skills – replace with real data from your Candidate entity
  const getSkills = (candidate: Candidate): string[] => {
    // Example – adapt to your real data structure
    return ["React", "TypeScript", "Node.js", "Python", "Figma"].slice(0, Math.floor(Math.random() * 4) + 1);
  };

  /* ---------------------------------- */
  /* Data loading                       */
  /* ---------------------------------- */
  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query: GetCandidatesQuery = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: mapStatusToQuery(filterStatus),
      };

      const response = await GetCandidateListUC.execute(query);

      setCandidates(response.candidates ?? []);
      setPagination((prev) => ({
        ...prev,
        total: response.total ?? 0,
        totalPages: response.total ? Math.ceil(response.total / prev.limit) : 1,
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

  /* ---------------------------------- */
  /* Actions                            */
  /* ---------------------------------- */
  const handleToggleStatus = (candidate: Candidate) => {
    setConfirmationDialog({
      open: true,
      candidate,
      action: candidate.isActive() ? "block" : "unblock",
    });
  };

  const confirmStatusToggle = async () => {
    if (!confirmationDialog.candidate?.userId) return;

    setActionLoading(true);
    const { action, candidate } = confirmationDialog;

    try {
      if (action === "block") {
        await blockCandidateUC.execute(candidate.userId);
        toast.success(`${candidate.name} blocked`, { icon: <ShieldAlert className="h-4 w-4 text-rose-600" /> });
      } else {
        await unblockCandidateUC.execute(candidate.userId);
        toast.success(`${candidate.name} unblocked`, { icon: <ShieldCheck className="h-4 w-4 text-emerald-600" /> });
      }
      await loadCandidates();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
      setConfirmationDialog({ open: false, candidate: null, action: null });
    }
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((p) => ({ ...p, page: newPage }));
  };

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50/70 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-20 px-6 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <h1 className="text-xl font-semibold text-slate-800">Candidate Management</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={loadCandidates} disabled={loading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Candidates
              </Button>
            </div>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white border-b px-6 py-4 sticky top-[60px] z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-screen-2xl mx-auto">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:ring-indigo-400"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(["All", "Active", "Blocked"] as FilterStatusUI[]).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "min-w-[90px]",
                    status === "Active" && "bg-emerald-600 hover:bg-emerald-700",
                    status === "Blocked" && "bg-rose-600 hover:bg-rose-700"
                  )}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error ? (
            <Card className="border-rose-200 bg-rose-50/40">
              <CardContent className="py-12 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-4" />
                <p className="text-rose-800 font-medium">{error}</p>
                <Button variant="outline" className="mt-6" onClick={loadCandidates}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700">No candidates found</h3>
                <p className="text-slate-500 mt-2">Try changing filters or search term.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b px-6 py-4">
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Candidates List
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Manage candidate profiles. Click actions for details.
                </p>
              </CardHeader>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-medium">
                    <tr>
                      <th className="px-6 py-4 text-left">Candidate</th>
                      <th className="px-6 py-4 text-left">Skills</th>
                      <th className="px-6 py-4 text-left">Experience</th>
                      <th className="px-6 py-4 text-left">Location</th>
                      <th className="px-6 py-4 text-center">Applications</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-left">Registered</th>
                      <th className="px-6 py-4 text-right pr-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidates.map((c) => {
                      const skills = getSkills(c);
                      const displayedSkills = skills.slice(0, 3);
                      const moreCount = skills.length - displayedSkills.length;

                      return (
                        <tr
                          key={c.userId}
                          className="hover:bg-indigo-50/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-slate-200">
                                <AvatarFallback className="bg-indigo-50 text-indigo-700 font-medium">
                                  {getInitials(c.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-slate-900">{c.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{c.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {displayedSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs bg-white border-slate-200 px-2.5 py-0.5"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {moreCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{moreCount}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {getExperienceDisplay(c.experience)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {c.location || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-700 font-medium">
                            {Math.floor(Math.random() * 20) + 1} {/* Replace with real data */}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-2.5 w-2.5 rounded-full",
                                    c.isActive() ? "bg-emerald-500" : "bg-rose-500"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border",
                                    c.isActive()
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : "bg-rose-50 text-rose-800 border-rose-200"
                                  )}
                                >
                                  {c.isActive() ? "Active" : "Blocked"}
                                </span>
                              </div>
                              <Switch
                                checked={c.isActive()}
                                onCheckedChange={() => handleToggleStatus(c)}
                                disabled={actionLoading}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {formatDate(c.registeredDate)}
                          </td>
                          <td className="px-6 py-4 text-right pr-8">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => navigate(`/admin/candidates/${c.userId}`)}
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
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t">
                  <div className="text-sm text-slate-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1}–
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => changePage(pagination.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => changePage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {pagination.totalPages > 5 && <span className="px-2 self-center">...</span>}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => changePage(pagination.page + 1)}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </main>

        {/* Confirmation */}
        <AlertDialog open={confirmationDialog.open}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmationDialog.action === "block" ? "Block Candidate?" : "Unblock Candidate?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {confirmationDialog.action}{" "}
                <strong>{confirmationDialog.candidate?.name}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmStatusToggle}
                disabled={actionLoading}
                className={cn(
                  confirmationDialog.action === "block"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}