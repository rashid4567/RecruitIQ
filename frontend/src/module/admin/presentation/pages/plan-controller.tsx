"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  DollarSign,
  Plus,
  BarChart3,
  Pencil,
  Copy,
  Trash2,
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Search,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import type { SubscriptionPlan } from "@/module/admin/domain/entities/subscription-plan.entity";
import { useNavigate } from "react-router-dom";

interface UIPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingFrequency: string;
  isActive: boolean;
  isRecommended: boolean;
  features: { name: string; included: boolean }[];
  subscriberCount: number;
  mrr: number;
  icon: "zap" | "sparkles" | "crown";
  color: "blue" | "emerald" | "amber";
}

function mapToUIPlan(plan: SubscriptionPlan): UIPlan {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description || "No description available",
    price: plan.price,
    currency: plan.currency,
    billingFrequency: plan.billingCycle,
    isActive: plan.isActive,
    isRecommended: plan.isPopular,
    features: plan.features,
    subscriberCount: 0,
    mrr: plan.price * 5,
    icon:
      plan.planType === "enterprise"
        ? "crown"
        : plan.planType === "pro"
          ? "sparkles"
          : "zap",
    color:
      plan.planType === "enterprise"
        ? "amber"
        : plan.planType === "pro"
          ? "emerald"
          : "blue",
  };
}

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
};

export default function PlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [uiPlans, setUiPlans] = useState<UIPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const { GetPlansUseCase } =
        await import("../../application/useCases/subscription.management/get-plans.usecase");

      const { ApiSubscriptionPlanRepository } =
        await import("../../infrastructure/repositories/Api-subscription.plan.repository");

      const repo = new ApiSubscriptionPlanRepository();
      const useCase = new GetPlansUseCase(repo);

      const result = await useCase.execute({ page: 1, limit: 50 });

      setPlans(result.plans);
      setUiPlans(result.plans.map(mapToUIPlan));
    } catch (err: any) {
      console.error("Failed to fetch plans:", err);
      setError(err?.message ?? "Failed to load plans. Please try again.");
      setUiPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleTogglePlan = async (id: string) => {
    setTogglingId(id);
    try {
      const plan = plans.find((p) => p.id === id);
      if (!plan) return;

      const { ApiSubscriptionPlanRepository } =
        await import("../../infrastructure/repositories/Api-subscription.plan.repository");
      const repo = new ApiSubscriptionPlanRepository();

      if (plan.isActive) {
        const { HidePlanUseCase } =
          await import("../../application/useCases/subscription.management/hide-plan.usecase");
        await new HidePlanUseCase(repo).execute(id);
      } else {
        const { UnhidePlanUseCase } =
          await import("../../application/useCases/subscription.management/unhide-plan.usecase");
        await new UnhidePlanUseCase(repo).execute(id);
      }

      await fetchPlans();
    } catch (err: any) {
      alert(err?.message ?? "Failed to update plan status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDuplicatePlan = async (id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;

    try {
      const { CreatePlanUseCase } =
        await import("../../application/useCases/subscription.management/create-plan.usecase");
      const { ApiSubscriptionPlanRepository } =
        await import("../../infrastructure/repositories/Api-subscription.plan.repository");
      const repo = new ApiSubscriptionPlanRepository();

      await new CreatePlanUseCase(repo).execute({
        name: `${plan.name} (Copy)`,
        planType: plan.planType,
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        billingInterval: plan.billingInterval,
        jobPostsPerMonth: plan.jobPostsPerMonth,
        screeningCredits: plan.screeningCredits,
        featuresAccess: plan.featuresAccess,
        features: plan.features,
        description: plan.description,
        isPopular: false,
      });

      await fetchPlans();
    } catch (err: any) {
      alert(err?.message ?? "Failed to duplicate plan");
    }
  };

  const handleDeletePlan = (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    setUiPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPlans = uiPlans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activePlans = uiPlans.filter((p) => p.isActive).length;
  const totalMRR = uiPlans.reduce((sum, p) => sum + p.mrr, 0);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-[260px] min-h-screen">
        {/* Header */}
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
                  className="h-10 w-64 rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm placeholder-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
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

        <div className="p-8">
          {/* Page Header */}
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
                Create Plan
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-500">
                    Active Plans
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-zinc-900">
                    {loading ? "—" : activePlans}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-500">
                    Simulated MRR
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-zinc-900">
                    {loading ? "—" : `₹${(totalMRR / 1000).toFixed(1)}K`}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <X className="h-5 w-5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
              <button
                onClick={fetchPlans}
                className="ml-auto font-semibold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-zinc-900">All Plans</h3>
              {!loading && (
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                  {filteredPlans.length} plans
                </span>
              )}
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-white"
                />
              ))}
            </div>
          )}

          {/* Plans Grid */}
          {!loading && !error && filteredPlans.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-2xl ${
                    plan.isRecommended
                      ? "border-2 border-amber-200 shadow-xl shadow-amber-500/20"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {plan.isRecommended && (
                    <div className="absolute -right-12 top-6 rotate-45 bg-linear-to-r from-amber-500 to-amber-600 px-12 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                      Popular
                    </div>
                  )}

                  <div className="p-6 pb-0">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${colorMap[plan.color]}`}
                      >
                        {plan.icon === "crown" ? (
                          <Crown className="h-6 w-6 text-white" />
                        ) : plan.icon === "sparkles" ? (
                          <Sparkles className="h-6 w-6 text-white" />
                        ) : (
                          <Zap className="h-6 w-6 text-white" />
                        )}
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => handleTogglePlan(plan.id)}
                        disabled={togglingId === plan.id}
                        title={
                          plan.isActive ? "Deactivate plan" : "Activate plan"
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all disabled:opacity-50 ${
                          plan.isActive
                            ? "bg-linear-to-r from-emerald-500 to-emerald-600"
                            : "bg-zinc-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${
                            plan.isActive
                              ? "translate-x-[22px]"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-zinc-900">
                          {plan.name}
                        </h3>
                        {!plan.isActive && (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-zinc-900">
                        ₹{plan.price.toLocaleString()}
                      </span>
                      <span className="text-base font-medium text-zinc-400">
                        /{plan.billingFrequency}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      What's included
                    </p>
                    <div className="space-y-3">
                      {plan.features.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                              <Check className="h-3 w-3 text-emerald-600" />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100">
                              <X className="h-3 w-3 text-zinc-400" />
                            </div>
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-zinc-700"
                                : "text-zinc-400 line-through"
                            }`}
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                 

                  <div className="flex gap-2 border-t border-zinc-100 p-4">
                    <button
                      onClick={() => navigate(`/admin/plans/create`)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white hover:brightness-110"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Plan
                    </button>
                   
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPlans.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-16">
              <Layers className="h-12 w-12 text-zinc-300" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                {searchQuery ? "No plans match your search" : "No plans yet"}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first subscription plan to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/admin/plans/create")}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Plan
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
