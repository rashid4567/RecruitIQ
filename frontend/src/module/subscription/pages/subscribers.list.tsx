import { useEffect, useState } from "react";
import { Users, TrendingUp, DollarSign, RefreshCw, Search } from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useSubscribers } from "../hooks/Admin.subscribers.Hooks/useSubscribers";
import { StatCard } from "@/shared/table/StatCard";
import { SubscriberTable } from "./components/Billing/SubscriberTable";

export default function BillingControl() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);



  const { data, isLoading, isError, isFetching, refetch } = useSubscribers({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter,
  });

  const subscribers = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total ?? 0;
  const activeCount = subscribers.filter(
    (s) => s.status?.toLowerCase() === "active",
  ).length;

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
              disabled={isFetching || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
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
            <StatCard
              label="Total Subscribers"
              value={total}
              icon={<Users className="w-5 h-5" />}
              iconBg="bg-gray-50 border-gray-100"
              iconColor="text-gray-500"
            />
            <StatCard
              label="Active on This Page"
              value={<span className="text-emerald-600">{activeCount}</span>}
              icon={<DollarSign className="w-5 h-5" />}
              iconBg="bg-emerald-50 border-emerald-100"
              iconColor="text-emerald-500"
            />
            <StatCard
              label="Growth This Month"
              value="+18%"
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-sky-50 border-sky-100"
              iconColor="text-sky-500"
              sub="↑ from last month"
              subColor="text-emerald-500"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  All Subscriptions
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {total} results
                  {isFetching && !isLoading ? " · Updating…" : ""}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search recruiter or company…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 text-sm placeholder:text-gray-300 transition-colors"
                  />
                </div>

                <select
                  value={statusFilter || ""}
                  onChange={(e) => {
                    setStatusFilter(e.target.value || undefined);
                    setCurrentPage(1);
                  }}
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

            <SubscriberTable
              subscribers={subscribers}
              loading={isLoading}
              isError={isError}
              onRetry={refetch}
              pagination={{ page: currentPage, limit, total, totalPages }}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
