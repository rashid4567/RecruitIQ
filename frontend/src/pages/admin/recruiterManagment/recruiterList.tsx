"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../../../components/admin/sideBar";
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
} from "lucide-react";
import { adminRecruiterService } from "../../../services/admin/admin.recruiter.service";
import type {
  Recruiter,
  RecruiterQueryParams,
} from "../../../types/admin/recruiter.types";
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
      return { bg: "bg-green-100", text: "text-green-800", label: "Verified" };
    case "pending":
      return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" };
    case "rejected":
      return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };
  }
};

const getSubscriptionStyles = (status: Recruiter["subscriptionStatus"]) => {
  switch (status) {
    case "active":
      return { bg: "bg-purple-100", text: "text-purple-800", label: "Active" };
    case "expired":
      return { bg: "bg-red-100", text: "text-red-800", label: "Expired" };
    case "free":
      return { bg: "bg-gray-100", text: "text-gray-800", label: "Free" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };
  }
};

export default function RecruitersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "verified" | "blocked"
  >("all");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecruiters, setTotalRecruiters] = useState(0);
  const navigate = useNavigate();

  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchInput, 500);

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: RecruiterQueryParams = {
        page,
        limit: 10,
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
    } catch (error) {
      console.error("Failed to fetch recruiters:", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeTab]);

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
    } catch (error) {
      console.error("Failed to toggle recruiter status:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } lg:ml-0`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 bg-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Recruiter Management
              </h1>
              <p className="text-gray-600 mt-1">
                {totalRecruiters} recruiters found • Page {page} of {totalPages}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Tabs and Actions */}
          <div className="mb-8">
            <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending Approval" },
                { key: "verified", label: "Verified" },
                { key: "blocked", label: "Blocked" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key as any)}
                  className={`pb-4 px-2 font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter size={20} />
                Advanced Filters
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Download size={20} />
                Export Data
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Recruiter Profile
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Verification Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Subscription
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Jobs Posted
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Account Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Joined Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruiters.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No recruiters found
                        </td>
                      </tr>
                    ) : (
                      recruiters.map((recruiter) => {
                        const statusStyles = getStatusStyles(
                          recruiter.verificationStatus
                        );
                        const subscriptionStyles = getSubscriptionStyles(
                          recruiter.subscriptionStatus
                        );

                        return (
                          <tr
                            key={recruiter._id}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            {/* Profile */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="font-semibold text-blue-600">
                                    {getInitials(recruiter.fullName)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {recruiter.fullName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {recruiter.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Verification Status */}
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles.bg} ${statusStyles.text}`}
                              >
                                {statusStyles.label}
                              </span>
                            </td>

                            {/* Subscription */}
                            <td className="px-6 py-4">
                              <div>
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${subscriptionStyles.bg} ${subscriptionStyles.text}`}
                                >
                                  {subscriptionStyles.label}
                                </span>
                              </div>
                            </td>

                            {/* Jobs Posted */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-medium">
                                  {recruiter.jobPostsUsed}
                                </span>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        (recruiter.jobPostsUsed / 25) * 100,
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
                                onClick={() =>
                                  toggleAccountStatus(
                                    recruiter._id,
                                    recruiter.isActive
                                  )
                                }
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                                  recruiter.isActive
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    recruiter.isActive
                                      ? "translate-x-7"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </td>

                            {/* Joined Date */}
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {formatDate(recruiter.createdAt)}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 relative">
                              <button
                                onClick={() =>
                                  setShowActionMenu(
                                    showActionMenu === recruiter._id
                                      ? null
                                      : recruiter._id
                                  )
                                }
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <MoreVertical size={20} />
                              </button>

                              {showActionMenu === recruiter._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/admin/recruiters/${recruiter._id}`
                                      );
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Handle edit
                                      setShowActionMenu(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Edit size={16} />
                                    Edit Profile
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await adminRecruiterService.verifyRecruiter(
                                          recruiter._id,
                                          "verified"
                                        );

                                        setRecruiters((prev) =>
                                          prev.map((r) =>
                                            r._id === recruiter._id
                                              ? {
                                                  ...r,
                                                  verificationStatus:
                                                    "verified",
                                                }
                                              : r
                                          )
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Failed to verify recruiter",
                                          err
                                        );
                                      } finally {
                                        setShowActionMenu(null);
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Shield size={16} />
                                    Verify Account
                                  </button>

                                  <button
                                    onClick={() =>
                                      toggleAccountStatus(
                                        recruiter._id,
                                        recruiter.isActive
                                      )
                                    }
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Ban size={16} />
                                    {recruiter.isActive
                                      ? "Block Account"
                                      : "Unblock Account"}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {recruiters.length > 0 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-gray-600">
                    Showing {recruiters.length} of {totalRecruiters} recruiters
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Show page numbers with ellipsis
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (page > 3) pageNum = page - 2 + i;
                        if (pageNum > totalPages) return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            page === pageNum
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && page < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="text-center mt-12 text-sm text-gray-600">
            © {new Date().getFullYear()} HireSmart Admin. All rights reserved.
          </div>
        </div>
      </main>

      {/* Close action menu when clicking outside */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  );
}
