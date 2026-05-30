'use client'

import React, { useState } from 'react'
import {
  Users,
  TrendingUp,
  DollarSign,
  MoreVertical,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Sidebar from '@/components/admin/sideBar'
import { useSubscribers } from '../hooks/Admin.subscribers.Hooks/useSubscribers'

import type { SubscribersListItem } from '@/module/subscription/domain/repositories/subscribers.plan.repository'

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    case 'expired':
      return 'bg-red-100 text-red-700 border border-red-200'
    case 'cancelled':
      return 'bg-orange-100 text-orange-700 border border-orange-200'
    case 'pending':
      return 'bg-amber-100 text-amber-700 border border-amber-200'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const getAvatar = (name: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
}

// Smart Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
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

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-gray-200 bg-gray-50">
      <p className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-700">{currentPage}</span> of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white border border-gray-300 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">⋯</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-2xl text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-200'
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
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white border border-gray-300 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-sm"
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top Navbar */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">RecruitIQ</h1>
                <p className="text-xs text-gray-500 -mt-1">Admin • Billing Control</p>
              </div>
            </div>

            <button
              onClick={refetch}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Billing Control</h1>
            <p className="mt-3 text-lg text-gray-600">
              Monitor and manage all subscription activities
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Subscribers</p>
                  <p className="text-5xl font-bold text-gray-900 mt-3">{data?.total || 0}</p>
                </div>
                <Users className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Now</p>
                  <p className="text-5xl font-bold text-emerald-600 mt-3">
                    {subscribers.filter(s => s.status?.toLowerCase() === 'active').length}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Growth This Month</p>
                  <p className="text-5xl font-bold text-gray-900 mt-3">+18%</p>
                  <p className="text-emerald-600 text-sm mt-1 font-medium">↑ from last month</p>
                </div>
                <TrendingUp className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white rounded-3xl shadow border border-gray-100 overflow-hidden">
            {/* Filters */}
            <div className="px-8 py-6 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">All Subscriptions</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {subscribers.length} results • Updated just now
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search recruiter or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 placeholder:text-gray-400"
                  />
                </div>

                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || undefined)}
                  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-250">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recruiter</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(isLoading || isFetching) ? (
                    Array.from({ length: limit }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                        <td className="px-6 py-6"><div className="h-10 bg-gray-200 rounded-full w-40"></div></td>
                        <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-44"></div></td>
                        <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-6"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                        <td className="px-8 py-6"><div className="h-8 w-8 bg-gray-200 rounded-xl mx-auto"></div></td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <p className="text-red-500 mb-4">Unable to load subscription data</p>
                        <button onClick={refetch} className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100">
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center text-gray-500">
                        No matching subscribers found
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub: SubscribersListItem) => (
                      <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-8 py-6 font-mono text-sm text-gray-600">{sub.id}</td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={getAvatar(sub.recruiterName)}
                              alt={sub.recruiterName}
                              className="w-10 h-10 rounded-2xl border border-gray-100"
                            />
                            <div className="font-medium text-gray-900">{sub.recruiterName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-gray-700">{sub.companyName}</td>
                        <td className="px-6 py-6 font-semibold text-gray-900">{sub.planName}</td>
                        <td className="px-6 py-6 text-gray-600">
                          {sub.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-6 text-gray-600">
                          {sub.endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-block px-5 py-1.5 text-xs font-semibold rounded-2xl ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Smart Pagination */}
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