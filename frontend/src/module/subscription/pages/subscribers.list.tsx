import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Search,
} from "lucide-react";

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
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useSubscribers({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter,
  });

  const subscribers = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total ?? 0;

  const activeCount = subscribers.filter(
    (subscriber) => subscriber.status?.toLowerCase() === "active",
  ).length;

  return (
    <div className="w-full min-w-0">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">

        {/* =========================
            PAGE HEADER
        ========================== */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              Billing Control
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500 sm:text-[15px]">
              Monitor and manage all subscription activities
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching || isLoading}
            className="
              inline-flex h-10 w-full shrink-0
              items-center justify-center gap-2
              rounded-xl border border-slate-200
              bg-white px-4
              text-sm font-medium text-slate-600
              shadow-sm
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            <RefreshCw
              className={`size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />

            <span>
              {isFetching && !isLoading ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </section>

        {/* =========================
            STAT CARDS
        ========================== */}
        <section
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            sm:gap-4
            xl:grid-cols-3
          "
        >
          <StatCard
            label="Total Subscribers"
            value={total}
            icon={<Users className="size-5" />}
            iconBg="bg-slate-50 border-slate-100"
            iconColor="text-slate-500"
          />

          <StatCard
            label="Active on This Page"
            value={
              <span className="text-emerald-600">
                {activeCount}
              </span>
            }
            icon={<DollarSign className="size-5" />}
            iconBg="bg-emerald-50 border-emerald-100"
            iconColor="text-emerald-500"
          />

          <StatCard
            label="Growth This Month"
            value="+18%"
            icon={<TrendingUp className="size-5" />}
            iconBg="bg-sky-50 border-sky-100"
            iconColor="text-sky-500"
            sub="↑ from last month"
            subColor="text-emerald-500"
          />
        </section>

        {/* =========================
            SUBSCRIPTIONS CARD
        ========================== */}
        <section
          className="
            min-w-0
            overflow-hidden
            rounded-xl
            border border-slate-200
            bg-white
            shadow-sm
            sm:rounded-2xl
          "
        >
          {/* Card Header */}
          <div
            className="
              flex flex-col
              gap-4
              border-b border-slate-100
              p-4
              sm:p-5
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-6
            "
          >
            {/* Title */}
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">
                All Subscriptions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {total} {total === 1 ? "result" : "results"}

                {isFetching && !isLoading && (
                  <span className="ml-1">
                    · Updating...
                  </span>
                )}
              </p>
            </div>

            {/* Filters */}
            <div
              className="
                flex w-full
                flex-col gap-2.5
                sm:flex-row
                lg:w-auto
              "
            >
              {/* Search */}
              <div className="relative w-full sm:flex-1 lg:w-64 lg:flex-none">
                <Search
                  className="
                    absolute left-3.5 top-1/2
                    size-4
                    -translate-y-1/2
                    text-slate-400
                    pointer-events-none
                  "
                />

                <input
                  type="search"
                  placeholder="Search recruiter or company..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="
                    h-10 w-full
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    pl-10 pr-4
                    text-sm text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    hover:border-slate-300
                    focus:border-indigo-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter || ""}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value || undefined,
                  );
                  setCurrentPage(1);
                }}
                className="
                  h-10 w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-3
                  text-sm text-slate-600
                  outline-none
                  transition-all
                  hover:border-slate-300
                  focus:border-indigo-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-100
                  sm:w-40
                "
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
          <div className="min-w-0 overflow-x-auto">
            <SubscriberTable
              subscribers={subscribers}
              loading={isLoading}
              isError={isError}
              onRetry={refetch}
              pagination={{
                page: currentPage,
                limit,
                total,
                totalPages,
              }}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>
    </div>
  );
}