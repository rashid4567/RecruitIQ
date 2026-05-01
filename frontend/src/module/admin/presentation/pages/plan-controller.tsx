"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  BarChart3,
  ArrowUpRight,
  Plus,
  Bell,
  Layers,
  DollarSign,
  X,
} from "lucide-react";

import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";

import {
  useSubscriptionPlans,
  type UIPlan,
} from "../hooks/Subscription.plans.Hooks/useSubscriptionPlans";
import PlanCard from "../components/subscription-plan-management/PlanCard";

export default function PlansPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    uiPlans,
    loading,
    error,
    activePlansCount,
    totalMRR,
    fetchPlans,
    togglePlanStatus,

    togglingId,
  } = useSubscriptionPlans();

  const filteredPlans: UIPlan[] = uiPlans.filter((plan: UIPlan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-zinc-900">
                Monetization
              </h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                Pro
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-64 rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm 
                             focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                  Subscription Plans
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Manage and configure your pricing tiers
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchPlans}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>

                <button className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </button>

                <button
                  onClick={() => navigate("/admin/plans/create")}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:brightness-110"
                >
                  <Plus className="h-4 w-4" />
                  Create New Plan
                </button>
              </div>
            </div>
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Active Plans</p>
                    <p className="text-3xl font-bold tracking-tight text-zinc-900 mt-2">
                      {loading ? "—" : activePlansCount}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Simulated MRR</p>
                    <p className="text-3xl font-bold tracking-tight text-zinc-900 mt-2">
                      {loading ? "—" : `₹${(totalMRR / 1000).toFixed(1)}K`}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <X className="h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
                <button
                  onClick={fetchPlans}
                  className="ml-auto font-semibold underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-zinc-900">All Plans</h3>
                {!loading && (
                  <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                    {filteredPlans.length} plans
                  </span>
                )}
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-white"
                  />
                ))}
              </div>
            ) : filteredPlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredPlans.map((plan: UIPlan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onToggle={togglePlanStatus}
                  
                    
                    togglingId={togglingId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-20">
                <Layers className="h-14 w-14 text-zinc-300" />
                <h3 className="mt-6 text-xl font-semibold text-zinc-900">
                  {searchQuery ? "No matching plans found" : "No subscription plans yet"}
                </h3>
                <p className="mt-2 text-zinc-500 text-center max-w-sm">
                  {searchQuery
                    ? "Try adjusting your search term"
                    : "Create your first plan to start monetizing"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => navigate("/admin/plans/create")}
                    className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Plan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}