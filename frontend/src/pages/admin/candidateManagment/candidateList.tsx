"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  Filter,
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
  Shield,
  TrendingUp,
  Users,
  FileText,
  Star,
  Building,
  Phone,
  RotateCw,
  RefreshCw,
  BarChart3,
  Award,
  Target,
} from "lucide-react";
import Sidebar from "../../../components/admin/sideBar";
import { candidateService } from "../../../services/admin/admin.candidate.service";
import type {
  Candidate,
  CandidateStatus,
} from "../../../types/admin/candidate.types";
import { useNavigate } from "react-router-dom";
import { getError } from "@/utils/getError";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CandidateManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState<"All" | CandidateStatus>(
    "All",
  );
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

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    applications: 0,
  });

  // Fetch candidates on mount and when filters change
  useEffect(() => {
    loadCandidates();
  }, [pagination.page, debouncedSearch, filterStatus]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status: filterStatus === "All" ? undefined : filterStatus,
      };

      const response = await candidateService.getCandidates(params);

      // Ensure all candidates have required properties
      const safeCandidates = response.candidates.map((candidate) => ({
        ...candidate,
        registeredDate: candidate.registeredDate || "Jan 1, 2024",
        location: candidate.location || "Not specified",
        skills: candidate.skills || [],
        applications: candidate.applications || 0,
        experience: candidate.experience || 0,
        email: candidate.email || "Not provided",
      }));

      setCandidates(safeCandidates);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: Math.ceil(response.pagination.total / prev.limit),
      }));

      // Calculate stats
      const active = safeCandidates.filter((c) => c.status === "Active").length;
      const blocked = safeCandidates.filter(
        (c) => c.status === "Blocked",
      ).length;
      const applications = safeCandidates.reduce(
        (acc, c) => acc + (c.applications || 0),
        0,
      );

      setStats({
        total: response.pagination.total,
        active,
        blocked,
        applications,
      });
    } catch (err: unknown) {
      console.error("Failed to load candidates:", err);
      setError(getError(err, "Failed to load candidates"));
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (
    candidateId: string,
    currentStatus: CandidateStatus,
  ) => {
    try {
      setActionLoading(true);
      const candidate = candidates.find((c) => c.id === candidateId);
      setSelectedCandidate(candidate || null);

      if (currentStatus === "Active") {
        await candidateService.blockCandidate(candidateId);
        // Update local state
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, status: "Blocked" }
              : candidate,
          ),
        );
      } else {
        await candidateService.unblockCandidate(candidateId);
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, status: "Active" }
              : candidate,
          ),
        );
      }

      setShowActionsMenu(null);
      loadCandidates(); // Refresh stats
    } catch (err: unknown) {
      console.error("Failed to update candidate status:", err);
      toast.error(getError(err || "Failed to update candidate status"));
    } finally {
      setActionLoading(false);
      setSelectedCandidate(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleExport = () => {
    // Export functionality - you can implement CSV/Excel export here
    console.log("Export candidates functionality");
  };

  const getStatusColor = (status: CandidateStatus) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-red-100 text-red-800";
  };

  const getExperienceColor = (years: number) => {
    if (years >= 8)
      return "bg-purple-100 text-purple-800 border border-purple-200";
    if (years >= 5) return "bg-blue-100 text-blue-800 border border-blue-200";
    if (years >= 3)
      return "bg-amber-100 text-amber-800 border border-amber-200";
    return "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getApplicationColor = (apps: number) => {
    if (apps >= 10)
      return "bg-green-100 text-green-800 border border-green-200";
    if (apps >= 5) return "bg-blue-100 text-blue-800 border border-blue-200";
    if (apps >= 1) return "bg-amber-100 text-amber-800 border border-amber-200";
    return "bg-gray-100 text-gray-800 border border-gray-200";
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not provided";

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

  // Loading state
  if (loading && candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <Users className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Candidates
              </h3>
              <p className="text-gray-600">Fetching candidate data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Admin</span>
                <span>›</span>
                <span>User Management</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">
                  Candidate Management
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-600" />
                Candidate Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/admin/recruiters")}
              >
                <Users size={18} />
                Recruiter Management
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => loadCandidates()}
              >
                <RefreshCw size={18} />
                Refresh
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={handleExport}
              >
                <Download size={18} />
                Export CSV
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Manage and monitor all candidate accounts, applications, and
            activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Candidates
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg text-white">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>All registered candidates</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Active</p>
                <p className="text-3xl font-bold text-green-700">
                  {stats.active}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-lg text-white">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Blocked
                </p>
                <p className="text-3xl font-bold text-red-700">
                  {stats.blocked}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-lg text-white">
                <UserX className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${stats.total ? (stats.blocked / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {stats.applications}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Across all candidates</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          {/* Search and Filters Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, location, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  {["All", "Active", "Blocked"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setFilterStatus(filter as "All" | CandidateStatus);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        filterStatus === filter
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <select
                  value={pagination.limit}
                  onChange={(e) => {
                    setPagination((prev) => ({
                      ...prev,
                      limit: parseInt(e.target.value),
                      page: 1,
                    }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex items-center gap-2">
              {(searchTerm || filterStatus !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All");
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
              {searchTerm && (
                <span className="text-sm text-gray-600">
                  Search results for:{" "}
                  <span className="font-medium">"{searchTerm}"</span>
                </span>
              )}
            </div>
          </div>

          {error ? (
            <div className="bg-white border border-red-200 rounded-xl p-8 shadow-sm">
              <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Error Loading Candidates
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                </div>
                <Button
                  onClick={loadCandidates}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw size={16} />
                  Retry Loading
                </Button>
              </div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="inline-flex p-4 bg-gray-100 rounded-xl mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Candidates Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== "All"
                  ? "No candidates match your search criteria. Try adjusting your filters."
                  : "No candidates have registered yet."}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Candidates Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          CANDIDATE
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          EXPERIENCE
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          LOCATION
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          APPLICATIONS
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          STATUS
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          REGISTERED
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {candidates.map((candidate) => {
                        const isSent = candidate.status === "Active";

                        return (
                          <tr
                            key={candidate.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* Candidate Info */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                    alt={candidate.name}
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                  />
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                      candidate.status === "Active"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {candidate.name || "Not provided"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm text-gray-500 truncate max-w-[180px]">
                                      {candidate.email || "Not provided"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Experience */}
                            <td className="px-6 py-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getExperienceColor(candidate.experience || 0)}`}
                              >
                                <Briefcase className="w-4 h-4" />
                                <span className="font-semibold">
                                  {candidate.experience || 0}
                                </span>
                                <span className="text-xs opacity-80">yrs</span>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium">
                                  {candidate.location || "Not specified"}
                                </span>
                              </div>
                            </td>

                            {/* Applications */}
                            <td className="px-6 py-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getApplicationColor(candidate.applications || 0)}`}
                              >
                                <FileText className="w-4 h-4" />
                                <span className="font-semibold">
                                  {candidate.applications || 0}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}
                              >
                                {candidate.status === "Active" ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <UserX className="w-4 h-4" />
                                )}
                                <span className="font-medium">
                                  {candidate.status}
                                </span>
                              </div>
                            </td>

                            {/* Registered Date */}
                            <td className="px-6 py-4 text-gray-500 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(candidate.registeredDate)}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="View Profile"
                                  onClick={() =>
                                    navigate(
                                      `/admin/candidates/${candidate.id}`,
                                    )
                                  }
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                                  title="More Actions"
                                  onClick={() =>
                                    setShowActionsMenu(
                                      showActionsMenu === candidate.id
                                        ? null
                                        : candidate.id,
                                    )
                                  }
                                  disabled={actionLoading}
                                >
                                  {actionLoading &&
                                  selectedCandidate?.id === candidate.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <MoreVertical size={18} />
                                  )}

                                  {/* Actions Dropdown */}
                                  {showActionsMenu === candidate.id && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowActionsMenu(null)}
                                      />
                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                                        <div className="p-2">
                                          <button
                                            onClick={() => {
                                              navigate(
                                                `/admin/candidates/${candidate.id}`,
                                              );
                                              setShowActionsMenu(null);
                                            }}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                          >
                                            <Eye className="w-4 h-4" />
                                            View Profile
                                          </button>

                                          {candidate.status === "Active" ? (
                                            <button
                                              onClick={() =>
                                                handleBlockUnblock(
                                                  candidate.id,
                                                  candidate.status,
                                                )
                                              }
                                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                              <UserX className="w-4 h-4" />
                                              Block Candidate
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() =>
                                                handleBlockUnblock(
                                                  candidate.id,
                                                  candidate.status,
                                                )
                                              }
                                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                              <UserCheck className="w-4 h-4" />
                                              Unblock Candidate
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    {candidates.length === 0
                      ? "No candidates found"
                      : `Showing ${
                          (pagination.page - 1) * pagination.limit + 1
                        } to ${Math.min(
                          pagination.page * pagination.limit,
                          pagination.total,
                        )} of ${pagination.total} candidates`}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                      className="gap-2"
                    >
                      <ChevronsLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="gap-2"
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          let pageNum: number;

                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (
                            pagination.page >=
                            pagination.totalPages - 2
                          ) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                pagination.page === pageNum
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="gap-2"
                    >
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.page === pagination.totalPages}
                      className="gap-2"
                    >
                      <ChevronsRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
