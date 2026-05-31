"use client";

import { CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../recruiter/presentation/pages/components/layout/Sidebar";
import { useCurrentSubscription } from "../hooks/subscriptions/useCurrentSubscription";

import StatusBadge from "./components/current.subscription/StatusBadge";
import SubscriptionOverview from "./components/current.subscription/SubscriptionOverview";
import UsageSection from "./components/current.subscription/UsageSection";
import BillingCard from "./components/current.subscription/BillingCard";
import PlanFeatures from "./components/current.subscription/PlanFeatures";
import UpgradeBanner from "./components/current.subscription/UpgradeBanner";
import QuickActions from "./components/current.subscription/QuickActions";
import EnterpriseCard from "./components/current.subscription/EnterpriseCard";
import UsageThisMonth from "./components/current.subscription/UsageThisMonth";

function computeOverallUsage(sub: {
  jobPostsUsed: number;
  jobPostsLimit: number;
  screeningUsed: number;
  screeningLimit: number;
  resumeUsed: number;
  resumeLimit: number;
  aiScoreUsed: number;
  aiScoreLimit: number;
}): number {
  return Math.round(
    ((sub.jobPostsUsed / sub.jobPostsLimit +
      sub.screeningUsed / sub.screeningLimit +
      sub.resumeUsed / sub.resumeLimit +
      sub.aiScoreUsed / sub.aiScoreLimit) /
      4) *
      100,
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <Shell>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Loading subscription...</p>
      </div>
    </Shell>
  );
}

function ErrorState() {
  return (
    <Shell>
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-semibold text-lg">
          Failed to load subscription
        </p>
        <p className="text-slate-500 mt-2">Please try again later</p>
      </div>
    </Shell>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <Shell>
      <div className="text-center">
        <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 font-semibold text-lg">
          No active subscription found
        </p>
        <button
          onClick={() => navigate("/recruiter/plans")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </Shell>
  );
}

export default function CurrentSubscriptionPage() {
  const { data, isLoading, error } = useCurrentSubscription();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data?.subscription) return <EmptyState />;

  const subscription = data.subscription;
  const overallUsage = computeOverallUsage(subscription);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Your Subscription
                </h1>
                <p className="text-slate-600">
                  Manage your plan, usage, and billing
                </p>
              </div>
              <StatusBadge status={subscription.status} />
            </div>

            <SubscriptionOverview
              subscription={subscription}
              overallUsage={overallUsage}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <UsageSection subscription={subscription} />
              <BillingCard subscription={subscription} />
              <PlanFeatures subscription={subscription} />
              <UpgradeBanner />
            </div>

            <div className="space-y-6">
              <QuickActions />
              <EnterpriseCard />
              <UsageThisMonth subscription={subscription} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
