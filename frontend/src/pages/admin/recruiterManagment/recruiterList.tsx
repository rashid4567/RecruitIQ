"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Shield,
  Ban,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  TrendingUp,
  Target,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { adminRecruiterService } from "../../../services/admin/admin.recruiter.service";
import type {
  Recruiter,
  RecruiterQueryParams,
} from "../../../types/admin/recruiter.types";
import { Button } from "@/components/ui/button";
import { getError } from "@/utils/getError";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const getStatusStyles = (status: Recruiter["verificationStatus"]) => {
  switch (status) {
    case "verified":
      return { 
        bg: "bg-green-100", 
        text: "text-green-800", 
        border: "border border-green-200",
        label: "Verified",
        icon: ShieldCheck 
      };
    case "pending":
      return { 
        bg: "bg-amber-100", 
        text: "text-amber-800", 
        border: "border border-amber-200",
        label: "Pending",
        icon: Clock 
      };
    case "rejected":
      return { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        border: "border border-red-200",
        label: "Rejected",
        icon: XCircle 
      };
    default:
      return { 
        bg: "bg-gray-100", 
        text: "text-gray-800", 
        border: "border border-gray-200",
        label: "Unknown",
        icon: AlertCircle 
      };
  }
};

const getSubscriptionStyles = (status: Recruiter["subscriptionStatus"]) => {
  switch (status) {
    case "active":
      return { 
        bg: "bg-purple-100", 
        text: "text-purple-800", 
        border: "border border-purple-200",
        label: "Active" 
      };
    case "expired":
      return { 
        bg: "bg-red-100", 
        text: "text-red-800", 
        border: "border border-red-200",
        label: "Expired" 
      };
    case "free":
      return { 
        bg: "bg-gray-100", 
        text: "text-gray-800", 
        border: "border border-gray-200",
        label: "Free" 
      };
    default:
      return { 
        bg: "bg-gray-100", 
        text: "text-gray-800", 
        border: "border border-gray-200",
        label: "Unknown" 
      };
  }
};

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "verified" | "blocked"
  >("all");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecruiters, setTotalRecruiters] = useState(0);
  const navigate = useNavigate();

  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    blocked: 0
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: RecruiterQueryParams = {
        page,
        limit,
        search: debouncedSearch || undefined,
        sort: "latest",
      };

      switch (activeTab) {
        case "pending":
          queryParams.verificationStatus = "pending";
          break;
        case "verified":
          queryParams.verificationStatus = "verified";
          break;
        case "blocked":
          queryParams.isActive = false;
          break;
      }

      const data = await adminRecruiterService.getRecruiters(queryParams);

      setRecruiters(data.recruiters || []);
      setTotalRecruiters(data.pagination?.total || 0);
      setTotalPages(
        data.pagination
          ? Math.ceil(data.pagination.total / data.pagination.limit)
          : 1
      );

      // Calculate stats (in a real app, you might want a separate endpoint for stats)
      const verified = data.recruiters?.filter(r => r.verificationStatus === "verified").length || 0;
      const pending = data.recruiters?.filter(r => r.verificationStatus === "pending").length || 0;
      const blocked = data.recruiters?.filter(r => !r.isActive).length || 0;
      
      setStats({
        total: data.pagination?.total || 0,
        verified,
        pending,
        blocked
      });
    } catch (err: unknown) {
      console.error("Failed to fetch recruiters:", err);
      setError(getError(err, "Failed to load recruiters"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, activeTab]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  // Handle tab change
  const handleTabChange = (tab: "all" | "pending" | "verified" | "blocked") => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const toggleAccountStatus = async (
    recruiterId: string,
    currentStatus: boolean
  ) => {
    try {
      setActionLoading(true);
      await adminRecruiterService.updateRecruiterStatus(
        recruiterId,
        !currentStatus
      );

      // Update local state after success
      setRecruiters((prev) =>
        prev.map((r) =>
          r._id === recruiterId ? { ...r, isActive: !currentStatus } : r
        )
      );
      fetchRecruiters(); // Refresh stats
    } catch (err) {
      console.error("Failed to toggle recruiter status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyRecruiter = async (recruiterId: string) => {
    try {
      setActionLoading(true);
      await adminRecruiterService.verifyRecruiter(
        recruiterId,
        "verified"
      );

      setRecruiters((prev) =>
        prev.map((r) =>
          r._id === recruiterId
            ? { ...r, verificationStatus: "verified" }
            : r
        )
      );
      setShowActionMenu(null);
      fetchRecruiters(); // Refresh stats
    } catch (err) {
      console.error("Failed to verify recruiter", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExport = () => {
    // Export functionality
    console.log("Export recruiters");
  };

  if (loading && recruiters.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading recruiters...</p>
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
                <span className="text-gray-900 font-medium">Recruiter Management</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building className="w-8 h-8 text-indigo-600" />
                Recruiter Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/admin/candidates')}
              >
                <Users size={18} />
                Candidate Management
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => fetchRecruiters()}
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
            Manage and monitor all recruiter accounts, verifications, and subscriptions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Total Recruiters</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg text-white">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>All registered recruiters</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Verified</p>
                <p className="text-3xl font-bold text-green-700">{stats.verified}</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-lg text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stats.total ? (stats.verified / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
                <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-3 rounded-lg text-white">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Blocked</p>
                <p className="text-3xl font-bold text-red-700">{stats.blocked}</p>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-lg text-white">
                <Ban className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
              <Target className="w-4 h-4 text-red-500" />
              <span>Restricted accounts</span>
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
                    placeholder="Search by name, email, or company..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  {["All", "Pending", "Verified", "Blocked"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleTabChange(filter.toLowerCase() as any)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === filter.toLowerCase() 
                          ? "bg-indigo-600 text-white" 
                          : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="bg-white border border-red-200 rounded-xl p-8 shadow-sm">
              <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Recruiters</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                </div>
                <Button
                  onClick={fetchRecruiters}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw size={16} />
                  Retry Loading
                </Button>
              </div>
            </div>
          ) : recruiters.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="inline-flex p-4 bg-gray-100 rounded-xl mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Recruiters Found</h3>
              <p className="text-gray-600 mb-6">
                {searchInput || activeTab !== "all" 
                  ? "No recruiters match your search criteria. Try adjusting your filters."
                  : "No recruiters have registered yet."}
              </p>
              {searchInput && (
                <Button
                  onClick={() => {
                    setSearchInput("");
                    setActiveTab("all");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Recruiters Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          RECRUITER
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          VERIFICATION
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          SUBSCRIPTION
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          JOBS POSTED
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          STATUS
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          JOINED
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recruiters.map((recruiter) => {
                        const statusStyles = getStatusStyles(recruiter.verificationStatus);
                        const subscriptionStyles = getSubscriptionStyles(recruiter.subscriptionStatus);
                        const StatusIcon = statusStyles.icon;

                        return (
                          <tr
                            key={recruiter._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* Recruiter Info */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recruiter.fullName}`}
                                    alt={recruiter.fullName}
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                  />
                                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                    recruiter.isActive ? "bg-green-500" : "bg-red-500"
                                  }`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">{recruiter.fullName}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm text-gray-500 truncate max-w-[180px]">
                                      {recruiter.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Verification */}
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="font-medium">{statusStyles.label}</span>
                              </div>
                            </td>
                            
                            {/* Subscription */}
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${subscriptionStyles.bg} ${subscriptionStyles.text} ${subscriptionStyles.border}`}>
                                <span className="font-medium">{subscriptionStyles.label}</span>
                              </div>
                            </td>
                            
                            {/* Jobs Posted */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="font-semibold">{recruiter.jobPostsUsed || 0}</span>
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        ((recruiter.jobPostsUsed || 0) / 25) * 100,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            
                            {/* Account Status */}
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleAccountStatus(recruiter._id, recruiter.isActive)}
                                disabled={actionLoading}
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                                  recruiter.isActive ? "bg-green-500" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    recruiter.isActive ? "translate-x-7" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </td>
                            
                            {/* Joined Date */}
                            <td className="px-6 py-4 text-gray-500 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(recruiter.createdAt)}
                              </div>
                            </td>
                            
                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="View Profile"
                                  onClick={() => navigate(`/admin/recruiters/${recruiter._id}`)}
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                                  title="More Actions"
                                  onClick={() => setShowActionMenu(showActionMenu === recruiter._id ? null : recruiter._id)}
                                  disabled={actionLoading}
                                >
                                  <MoreVertical size={18} />
                                  
                                  {/* Actions Dropdown */}
                                  {showActionMenu === recruiter._id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setShowActionMenu(null)}
                                      />
                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                                        <div className="p-2">
                                          <button
                                            onClick={() => {
                                              navigate(`/admin/recruiters/${recruiter._id}`);
                                              setShowActionMenu(null);
                                            }}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                          >
                                            <Eye className="w-4 h-4" />
                                            View Profile
                                          </button>
                                          
                                          <button
                                            onClick={() => {
                                              // Edit profile logic
                                              setShowActionMenu(null);
                                            }}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                          >
                                            <Edit className="w-4 h-4" />
                                            Edit Profile
                                          </button>
                                          
                                          {recruiter.verificationStatus === "pending" && (
                                            <button
                                              onClick={() => handleVerifyRecruiter(recruiter._id)}
                                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                              <Shield className="w-4 h-4" />
                                              Verify Account
                                            </button>
                                          )}
                                          
                                          <button
                                            onClick={() => toggleAccountStatus(recruiter._id, recruiter.isActive)}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          >
                                            <Ban className="w-4 h-4" />
                                            {recruiter.isActive ? "Block Account" : "Unblock Account"}
                                          </button>
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
                    {recruiters.length === 0
                      ? "No recruiters found"
                      : `Showing ${
                          (page - 1) * limit + 1
                        } to ${Math.min(
                          page * limit,
                          totalRecruiters
                        )} of ${totalRecruiters} recruiters`}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="gap-2"
                    >
                      <ChevronsLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className="gap-2"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              page === pageNum
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className="gap-2"
                    >
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
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