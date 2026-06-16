import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  MoreVertical,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useSubscribers } from "../hooks/Admin.subscribers.Hooks/useSubscribers";
import type { SubscribersListItem } from "@/module/subscription/domain/repositories/subscribers.plan.repository";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "expired":
      return "bg-red-50 text-red-600 border border-red-200";
    case "cancelled":
      return "bg-orange-50 text-orange-600 border border-orange-200";
    case "pending":
      return "bg-amber-50 text-amber-600 border border-amber-200";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
};

const getAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-white">
      <p className="text-sm text-gray-400">
        Page <span className="font-medium text-gray-600">{currentPage}</span> of{" "}
        {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-300 text-sm">⋯</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function BillingControl() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const limit = 10;

  const { data, isLoading, isError, isFetching, refetch } = useSubscribers({
    page: currentPage,
    limit,
    search: search || undefined,
    status: statusFilter,
  });

  const subscribers = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900 leading-none">
                  RecruitIQ
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Admin · Billing Control
                </p>
              </div>
            </div>

            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Billing Control
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Monitor and manage all subscription activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    Total Subscribers
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-3">
                    {data?.total || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    Active Now
                  </p>
                  <p className="text-4xl font-bold text-emerald-600 mt-3">
                    {
                      subscribers.filter(
                        (s) => s.status?.toLowerCase() === "active",
                      ).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    Growth This Month
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-3">+18%</p>
                  <p className="text-xs text-emerald-500 font-medium mt-1">
                    ↑ from last month
                  </p>
                </div>
                <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-sky-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  All Subscriptions
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {subscribers.length} results · Updated just now
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search recruiter or company…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300 transition-colors"
                  />
                </div>

                <select
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || undefined)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 text-sm text-gray-600 transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-225">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      "ID",
                      "Recruiter",
                      "Company",
                      "Plan",
                      "Start Date",
                      "End Date",
                      "Status",
                      "Action",
                    ].map((col) => (
                      <th
                        key={col}
                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${col === "Action" ? "text-center" : ""}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {isLoading || isFetching ? (
                    Array.from({ length: limit }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-5">
                          <div className="h-3.5 bg-gray-100 rounded w-24" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-9 bg-gray-100 rounded-xl w-36" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-3.5 bg-gray-100 rounded w-40" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-3.5 bg-gray-100 rounded w-28" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-3.5 bg-gray-100 rounded w-20" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-3.5 bg-gray-100 rounded w-20" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-6 bg-gray-100 rounded-full w-18" />
                        </td>
                        <td className="px-6 py-5">
                          <div className="h-7 w-7 bg-gray-100 rounded-xl mx-auto" />
                        </td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <p className="text-sm text-red-500 mb-3">
                          Unable to load subscription data
                        </p>
                        <button
                          onClick={refetch}
                          className="px-5 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-100 transition-colors"
                        >
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : subscribers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-sm text-gray-400"
                      >
                        No matching subscribers found
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub: SubscribersListItem) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-gray-50/60 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                          {sub.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getAvatar(sub.recruiterName)}
                              alt={sub.recruiterName}
                              className="w-9 h-9 rounded-xl border border-gray-100 bg-gray-50"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {sub.recruiterName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {sub.companyName}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          {sub.planName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {sub.startDate.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {sub.endDate.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
