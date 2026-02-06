"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  CheckCircle,
  Users,
  FileText,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Filter,
  ChevronDown,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Check,
  XCircle,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Candidate } from "../../domain/entities/candidates.entity";
import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import { blockCandidateUC, GetCandidateListUC, unblockCandidateUC } from "../di/candidate.di";
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
import { Badge } from "@/components/ui/badge";

export default function CandidateManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState<GetCandidatesQuery["status"]>("All");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    applications: 0,
    avgExperience: 0,
  });


  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    candidate: Candidate | null;
    action: "block" | "unblock" | null;
  }>({
    open: false,
    candidate: null,
    action: null,
  });

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: GetCandidatesQuery = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: filterStatus,
      };

      const response = await GetCandidateListUC.execute(query);
      
      setCandidates(response.candidates);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: Math.ceil(response.total / prev.limit),
      }));

      // Calculate stats
      const active = response.candidates.filter((c) => c.isActive()).length;
      const blocked = response.candidates.filter((c) => c.isBlocked()).length;
      const applications = response.candidates.reduce((acc, c) => acc + c.applications, 0);
      const avgExperience = response.candidates.length > 0 
        ? response.candidates.reduce((acc, c) => acc + c.experience, 0) / response.candidates.length
        : 0;

      setStats({
        total: response.total,
        active,
        blocked,
        applications,
        avgExperience: parseFloat(avgExperience.toFixed(1)),
      });
    } catch (err: unknown) {
      console.error("Failed to load candidates:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load candidates";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filterStatus]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleToggleStatus = async (candidate: Candidate) => {
    const isCurrentlyActive = candidate.isActive();
    
    setConfirmationDialog({
      open: true,
      candidate,
      action: isCurrentlyActive ? "block" : "unblock",
    });
  };

  const confirmStatusToggle = async () => {
    if (!confirmationDialog.candidate) return;

    try {
      setActionLoading(true);
      const { candidate, action } = confirmationDialog;

      if (action === "block") {
        await blockCandidateUC.execute(candidate.userId);
        toast.success(`${candidate.name} has been blocked`, {
          description: "Candidate can no longer access the platform.",
          icon: <ShieldAlert className="w-4 h-4" />,
        });
      } else {
        await unblockCandidateUC.execute(candidate.userId);
        toast.success(`${candidate.name} has been unblocked`, {
          description: "Candidate can now access the platform.",
          icon: <ShieldCheck className="w-4 h-4" />,
        });
      }

      await loadCandidates();
    } catch (err) {
      console.error("Failed to update candidate status:", err);
      const message = err instanceof Error ? err.message : "Failed to update candidate status";
      toast.error(message, {
        icon: <XCircle className="w-4 h-4" />,
      });
    } finally {
      setActionLoading(false);
      setConfirmationDialog({ open: false, candidate: null, action: null });
      setShowActionsMenu(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Status", "Experience", "Applications", "Location", "Registered Date", "Skills"],
      ...candidates.map(c => [
        c.userId,
        c.name,
        c.email,
        c.status,
        c.experience,
        c.applications,
        c.location || "Not specified",
        c.registeredDate,
        c.skills?.join("; ") || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Export started", {
      description: "Your CSV file will download shortly.",
      icon: <Download className="w-4 h-4" />,
    });
  };

  const getStatusColor = (status: "Active" | "Blocked") => {
    return status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getExperienceLevel = (years: number) => {
    if (years >= 8) return { label: "Expert", color: "bg-purple-100 text-purple-800 border-purple-200" };
    if (years >= 5) return { label: "Senior", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (years >= 3) return { label: "Mid-level", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Junior", color: "bg-gray-100 text-gray-800 border-gray-200" };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not provided";

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 1) return "Today";
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Not provided";
    }
  };


  if (loading && candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
              <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Loading Candidates</h3>
              <p className="text-gray-600">Fetching candidate data from the server...</p>
            </div>
            <div className="pt-4">
              <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="hover:text-gray-700 cursor-pointer">Admin</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="hover:text-gray-700 cursor-pointer">User Management</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gray-900 font-semibold">Candidate Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
                    <p className="text-gray-600">Manage and monitor all candidate accounts</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  onClick={() => navigate("/admin/recruiters")}
                >
                  <Users size={18} />
                  Recruiter View
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  onClick={loadCandidates}
                  disabled={loading}
                >
                  <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                  Refresh
                </Button>
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2 shadow-lg shadow-indigo-500/25"
                  onClick={handleExport}
                >
                  <Download size={18} />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Total Candidates</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>All registered users</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Active</p>
                  <p className="text-4xl font-bold text-green-700">{stats.active}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Percentage</span>
                  <span className="font-semibold text-green-700">
                    {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Blocked</p>
                  <p className="text-4xl font-bold text-rose-700">{stats.blocked}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl text-white shadow-lg">
                  <UserX className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Percentage</span>
                  <span className="font-semibold text-rose-700">
                    {stats.total > 0 ? ((stats.blocked / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.blocked / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Applications</p>
                  <p className="text-4xl font-bold text-purple-700">{stats.applications}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span>Across all candidates</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">Avg Experience</p>
                  <p className="text-4xl font-bold text-amber-700">{stats.avgExperience}yrs</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Average across candidates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto px-8 pb-8">
            {/* Enhanced Search and Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm backdrop-blur-sm bg-white/50">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex-1 w-full">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search by name, email, location, or skills..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    {(["All", "Active", "Blocked"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setFilterStatus(filter);
                          setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          filterStatus === filter
                            ? "bg-white text-indigo-700 shadow-sm border border-gray-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={pagination.limit}
                      onChange={(e) => {
                        setPagination((prev) => ({
                          ...prev,
                          limit: parseInt(e.target.value),
                          page: 1,
                        }));
                      }}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters Badge */}
              {(searchTerm || filterStatus !== "All") && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    <div className="flex items-center gap-2">
                      {searchTerm && (
                        <Badge variant="outline" className="gap-2 bg-blue-50 border-blue-200">
                          Search: "{searchTerm}"
                          <button onClick={() => setSearchTerm("")}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      {filterStatus !== "All" && (
                        <Badge variant="outline" className="gap-2 bg-indigo-50 border-indigo-200">
                          Status: {filterStatus}
                          <button onClick={() => setFilterStatus("All")}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("All");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error ? (
              <div className="bg-white rounded-2xl border border-red-200 p-12 shadow-sm">
                <div className="text-center space-y-6">
                  <div className="inline-flex p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Candidates</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                  </div>
                  <Button
                    onClick={loadCandidates}
                    variant="outline"
                    className="gap-2 border-gray-300 hover:border-gray-400"
                  >
                    <RefreshCw size={16} />
                    Retry Loading
                  </Button>
                </div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="inline-flex p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Candidates Found</h3>
                    <p className="text-gray-600 mb-8">
                      {searchTerm || filterStatus !== "All"
                        ? "No candidates match your search criteria. Try adjusting your filters."
                        : "No candidates have registered yet."}
                    </p>
                  </div>
                  {(searchTerm || filterStatus !== "All") && (
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("All");
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <X size={16} />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Candidates Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-8 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Candidate
                          </th>
                          <th className="px-6 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Experience
                          </th>
                          <th className="px-6 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Applications
                          </th>
                          <th className="px-6 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Registered
                          </th>
                          <th className="px-6 py-5 text-left font-semibold text-gray-700 text-sm uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {candidates.map((candidate) => {
                          const experienceLevel = getExperienceLevel(candidate.experience);
                          return (
                            <tr
                              key={candidate.userId}
                              className="hover:bg-gray-50/50 transition-colors duration-200 group"
                            >
                              {/* Candidate Info */}
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img
                                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                      alt={candidate.name}
                                      className="w-12 h-12 rounded-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${candidate.isActive() ? "bg-emerald-500" : "bg-rose-500"}`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                                      {candidate.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                        {candidate.email}
                                      </span>
                                    </div>
                                    {candidate.skills && candidate.skills.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {candidate.skills.slice(0, 2).map((skill, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                        {candidate.skills.length > 2 && (
                                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                                            +{candidate.skills.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Experience */}
                              <td className="px-6 py-5">
                                <div className="space-y-1.5">
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${experienceLevel.color}`}>
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span className="font-semibold">{candidate.experience}</span>
                                    <span className="text-xs opacity-80">yrs</span>
                                  </div>
                                  <p className="text-xs text-gray-500">{experienceLevel.label}</p>
                                </div>
                              </td>

                              {/* Location */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2.5 text-gray-700">
                                  <div className="p-1.5 bg-blue-50 rounded-lg">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {candidate.location || "Remote"}
                                  </span>
                                </div>
                              </td>

                              {/* Applications */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                    candidate.applications >= 10 ? "bg-green-50 text-green-700 border border-green-200" :
                                    candidate.applications >= 5 ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                    candidate.applications >= 1 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                    "bg-gray-50 text-gray-700 border border-gray-200"
                                  }`}>
                                    <span className="font-bold">{candidate.applications}</span>
                                  </div>
                                  {candidate.applications > 5 && (
                                    <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                                      <Star className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Status with Toggle Switch */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(candidate.status)}`}>
                                    {candidate.status === "Active" ? (
                                      <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />
                                    ) : (
                                      <UserX className="w-3.5 h-3.5 inline mr-1.5" />
                                    )}
                                    <span className="font-medium">{candidate.status}</span>
                                  </div>
                                  <div className="relative">
                                    <Switch
                                      checked={candidate.isActive()}
                                      onCheckedChange={() => handleToggleStatus(candidate)}
                                      className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300"
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Registered Date */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2.5 text-gray-600">
                                  <div className="p-1.5 bg-gray-50 rounded-lg">
                                    <Calendar className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{formatDate(candidate.registeredDate)}</p>
                                    <p className="text-xs text-gray-400">Registered</p>
                                  </div>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="View Profile"
                                    onClick={() => navigate(`/admin/candidates/${candidate.userId}`)}
                                  >
                                    <Eye className="w-4 h-4 text-gray-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                                    title="More Actions"
                                    onClick={() => setShowActionsMenu(
                                      showActionsMenu === candidate.userId ? null : candidate.userId
                                    )}
                                    disabled={actionLoading}
                                  >
                                    {actionLoading ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <MoreVertical className="w-4 h-4 text-gray-500" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                      <span className="font-semibold text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                      <span className="font-semibold text-gray-900">{pagination.total}</span> candidates
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.page === 1}
                          className="p-2 rounded-lg border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronsLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="p-2 rounded-lg border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1 mx-2">
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.page >= pagination.totalPages - 2) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={pagination.page === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-9 h-9 rounded-lg ${
                                  pagination.page === pageNum
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="p-2 rounded-lg border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.totalPages)}
                          disabled={pagination.page === pagination.totalPages}
                          className="p-2 rounded-lg border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronsRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmationDialog.open} onOpenChange={(open) => {
        if (!open) setConfirmationDialog({ open: false, candidate: null, action: null });
      }}>
        <AlertDialogContent className="max-w-md rounded-2xl border-gray-200">
          <AlertDialogHeader>
            <div className="mx-auto mb-4">
              {confirmationDialog.action === "block" ? (
                <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-50 rounded-full">
                  <ShieldAlert className="w-8 h-8 text-rose-600" />
                </div>
              ) : (
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
              )}
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold text-gray-900">
              {confirmationDialog.action === "block" ? "Block Candidate" : "Unblock Candidate"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600">
              {confirmationDialog.action === "block" ? (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold text-gray-900">{confirmationDialog.candidate?.name}</span>?
                  <br />
                  <span className="text-rose-600 font-medium">This will prevent them from accessing the platform.</span>
                </>
              ) : (
                <>
                  Are you sure you want to unblock{" "}
                  <span className="font-semibold text-gray-900">{confirmationDialog.candidate?.name}</span>?
                  <br />
                  <span className="text-emerald-600 font-medium">They will regain access to the platform.</span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="w-full border-gray-300 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusToggle}
              disabled={actionLoading}
              className={`w-full ${
                confirmationDialog.action === "block"
                  ? "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              }`}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {confirmationDialog.action === "block" ? "Blocking..." : "Unblocking..."}
                </>
              ) : (
                <>
                  {confirmationDialog.action === "block" ? (
                    <>
                      <ShieldAlert className="w-4 h-4 mr-2" />
                      Yes, Block Candidate
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Yes, Unblock Candidate
                    </>
                  )}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}