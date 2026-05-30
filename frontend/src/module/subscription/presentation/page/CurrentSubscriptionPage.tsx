"use client";

import {
  CreditCard,
  Brain,
  FileText,
  Search,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  MoreVertical,
  Flame,
  Lock,
  Wifi,
} from "lucide-react";
import { useCurrentSubscription } from "../hooks/subscriptions/useCurrentSubscription";
import Sidebar from "../../../recruiter/presentation/pages/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";

function StatusBadge({ status }: { status: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
      <span className="text-sm font-semibold text-emerald-700">{status}</span>
    </div>
  );
}

interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
  linear: string;
  description?: string;
}

function UsageCard({
  title,
  used,
  limit,
  icon,
  linear,
  description,
}: UsageCardProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage > 80;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 transition-all hover:shadow-lg hover:shadow-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-linear-to-br ${linear}`}>{icon}</div>
        {isNearLimit && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Warning
            </span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-slate-900">{used}</span>
          <span className="text-slate-500">/ {limit}</span>
        </div>
        {description && <p className="text-xs text-slate-600">{description}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">{percentage.toFixed(0)}% used</span>
          <span
            className={`font-semibold ${isNearLimit ? "text-amber-700" : "text-slate-700"}`}
          >
            {limit - used} remaining
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isNearLimit
                ? "bg-linear-to-r from-amber-500 to-orange-500"
                : "bg-linear-to-r from-blue-600 to-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BillingCard({ subscription }: { subscription: RecruiterSubscription }) {
  const endDate = new Date(subscription.endDate);
  const daysUntilEnd = Math.ceil(
    (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">
              Plan Price
            </p>
            <h2 className="text-4xl font-bold text-white">
              ₹{subscription.planPrice.toLocaleString()}
            </h2>
            <p className="text-blue-100 text-sm mt-2">
              {subscription.planType}
            </p>
          </div>
          <CreditCard className="h-12 w-12 text-blue-200 opacity-50" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Start Date
            </p>
            <p className="text-lg font-bold text-slate-900">
              {new Date(subscription.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
              End Date
            </p>
            <p className="text-lg font-bold text-slate-900">
              {endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <Wifi className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-slate-700">
            Status:{" "}
            <span className="font-semibold text-blue-700">{subscription.status}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Days remaining</span>
          <span className="text-lg font-bold text-blue-600">{daysUntilEnd} days</span>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
          <Download className="h-4 w-4" />
          Download Invoice
        </button>
      </div>
    </div>
  );
}

function PlanFeatures({ subscription }: { subscription: RecruiterSubscription }) {
  const features = [
    { name: "Job Posts", value: subscription.jobPostsLimit, unit: "/month" },
    {
      name: "Screening Credits",
      value: subscription.screeningLimit,
      unit: "credits",
    },
    { name: "Resume Parsing", value: subscription.resumeLimit, unit: "/month" },
    { name: "AI Scoring", value: subscription.aiScoreLimit, unit: "credits" },
    { name: "Team Members", value: "Unlimited", unit: "" },
    { name: "Priority Support", value: "24/7", unit: "" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        What&apos;s Included
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mb-1">
              {feature.name}
            </p>
            <p className="text-xl font-bold text-slate-900">
              {feature.value}
              <span className="text-xs text-slate-500 font-normal">
                {" "}
                {feature.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpgradeBanner() {
    const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-blue-600 to-blue-700 overflow-hidden">
      <div className="px-6 py-8 md:flex md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Flame className="h-6 w-6" />
            Ready to scale?
          </h3>
          <p className="text-blue-100 max-w-sm">
            Upgrade to Enterprise for unlimited features, dedicated support, and
            advanced analytics for your recruitment needs.
          </p>
        </div>
        <button
  onClick={() => navigate("/recruiter/plans")}
  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold transition-colors whitespace-nowrap"
>
  View Plans
  <ArrowRight className="h-5 w-5" />
</button>
      </div>
    </div>
  );
}

export default function CurrentSubscriptionPage() {
  const { data, isLoading, error } = useCurrentSubscription();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold text-lg">
              Failed to load subscription
            </p>
            <p className="text-slate-500 mt-2">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.subscription) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center">
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
        </div>
      </div>
    );
  }

  const subscription = data.subscription;

  const overallUsage = Math.round(
    ((subscription.jobPostsUsed / subscription.jobPostsLimit +
      subscription.screeningUsed / subscription.screeningLimit +
      subscription.resumeUsed / subscription.resumeLimit +
      subscription.aiScoreUsed / subscription.aiScoreLimit) /
      4) *
      100,
  );

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

            <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Current Plan
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {subscription.planName}
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    {subscription.planType} plan
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Subscription Since
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {new Date(subscription.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(subscription.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Overall Usage
                  </p>
                  <h2 className="text-2xl font-bold text-blue-600">
                    {overallUsage}%
                  </h2>
                  <div className="h-2 rounded-full bg-slate-200 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-blue-500"
                      style={{ width: `${overallUsage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Current Usage
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <UsageCard
                    title="Job Posts"
                    used={subscription.jobPostsUsed}
                    limit={subscription.jobPostsLimit}
                    icon={<Briefcase className="h-6 w-6 text-white" />}
                    linear="from-blue-600 to-blue-500"
                    description="Active listings per month"
                  />
                  <UsageCard
                    title="Screening Credits"
                    used={subscription.screeningUsed}
                    limit={subscription.screeningLimit}
                    icon={<Search className="h-6 w-6 text-white" />}
                    linear="from-emerald-600 to-emerald-500"
                    description="AI-powered screening"
                  />
                  <UsageCard
                    title="Resume Parsing"
                    used={subscription.resumeUsed}
                    limit={subscription.resumeLimit}
                    icon={<FileText className="h-6 w-6 text-white" />}
                    linear="from-purple-600 to-purple-500"
                    description="Automated parsing per month"
                  />
                  <UsageCard
                    title="AI Scoring"
                    used={subscription.aiScoreUsed}
                    limit={subscription.aiScoreLimit}
                    icon={<Brain className="h-6 w-6 text-white" />}
                    linear="from-orange-600 to-orange-500"
                    description="Candidate evaluation credits"
                  />
                </div>
              </div>

              <BillingCard subscription={subscription} />

              <PlanFeatures subscription={subscription} />

              <UpgradeBanner />
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/recruiter/plans")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all"
                  >
                    <span>Upgrade Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                    <span>Manage Billing</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                    <span>Download Invoice</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Enterprise Plan
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get unlimited everything with dedicated account manager and
                  priority support.
                </p>
                <button className="w-full px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                  Learn More
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Usage This Month
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">Job Posts</span>
                      <span className="text-slate-900 font-semibold">
                        {Math.round(
                          (subscription.jobPostsUsed /
                            subscription.jobPostsLimit) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{
                          width: `${(subscription.jobPostsUsed / subscription.jobPostsLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">Screening</span>
                      <span className="text-slate-900 font-semibold">
                        {Math.round(
                          (subscription.screeningUsed /
                            subscription.screeningLimit) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600"
                        style={{
                          width: `${(subscription.screeningUsed / subscription.screeningLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">Parsing</span>
                      <span className="text-slate-900 font-semibold">
                        {Math.round(
                          (subscription.resumeUsed / subscription.resumeLimit) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{
                          width: `${(subscription.resumeUsed / subscription.resumeLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}