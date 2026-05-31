import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Crown,
  TrendingUp,
  Download,
  Star,
  Check,
  Loader2,
} from "lucide-react";

import { useCurrentSubscription } from "@/module/subscription/presentation/hooks/subscriptions/useCurrentSubscription";
import { usePricingPlans } from "@/module/subscription/presentation/hooks/subscriptions/usePricingPlans";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import type { PlanType } from "../../types/subscription.types";


export function BillingSection() {
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useCurrentSubscription();
  const {
    plans,
    loading: plansLoading,
    handleSubscribe,
    setSelectedPlanId,
  } = usePricingPlans();
  const [billingHistory] = useState([
    {
      id: 1,
      date: "Jan 15, 2024",
      plan: "Free Plan",
      amount: "$0.00",
      status: "paid",
    },
    {
      id: 2,
      date: "Dec 15, 2023",
      plan: "Free Plan",
      amount: "$0.00",
      status: "paid",
    },
    {
      id: 3,
      date: "Nov 15, 2023",
      plan: "Free Plan",
      amount: "$0.00",
      status: "paid",
    },
  ]);

  const subscription = subscriptionData?.subscription as
    | RecruiterSubscription
    | undefined;

  // Calculate usage percentages
  const jobPostsPercentage =
    subscription && subscription.jobPostsLimit > 0
      ? (subscription.jobPostsUsed / subscription.jobPostsLimit) * 100
      : 0;

  const screeningPercentage =
    subscription && subscription.screeningLimit > 0
      ? (subscription.screeningUsed / subscription.screeningLimit) * 100
      : 0;

  const resumePercentage =
    subscription && subscription.resumeLimit > 0
      ? (subscription.resumeUsed / subscription.resumeLimit) * 100
      : 0;

  const aiScorePercentage =
    subscription && subscription.aiScoreLimit > 0
      ? (subscription.aiScoreUsed / subscription.aiScoreLimit) * 100
      : 0;

  const getPlanButtonText = (planName: string) => {
    if (!subscription) return "Upgrade Now";
    if (subscription.planName === planName) return "Current Plan";
    return "Upgrade Now";
  };

  const getPlanButtonVariant = (
    planName: string,
  ): "default" | "outline" | "ghost" => {
    if (!subscription) return "default";
    if (subscription.planName === planName) return "outline";
    return "default";
  };

  const handleUpgradeClick = async (planId: string) => {
    setSelectedPlanId(planId);
    await handleSubscribe();
  };

  if (subscriptionLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600">Loading...</span>
      </div>
    );
  }

  const nextBillingDate = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const daysRemaining = subscription?.endDate
    ? Math.ceil(
        (new Date(subscription.endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  // Get features array safely with fallback - handles both string[] and object[] formats
  const getPlanFeatures = (plan: any): string[] => {
    if (plan.features && Array.isArray(plan.features)) {
      // Check if features are objects with 'name' property or just strings
      if (plan.features.length > 0 && typeof plan.features[0] === "object") {
        return plan.features.map(
          (feature: any) => feature.name || feature.feature || String(feature),
        );
      }
      return plan.features;
    }

    // Fallback features based on plan name
    if (plan.name === "Free") {
      return [
        "Up to 5 job posts",
        "Basic analytics dashboard",
        "Email support",
        "100 applications/month",
        "Standard templates",
      ];
    }
    if (plan.name === "Professional") {
      return [
        "Unlimited job posts",
        "Advanced analytics",
        "Priority support",
        "Unlimited applications",
        "AI-powered matching",
        "Custom branding",
        "Team collaboration",
      ];
    }
    return [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
      "Custom workflows",
      "Onboarding support",
    ];
  };

  // Helper to check if subscription plan type matches string
  const isYearlyPlan = (planType: PlanType | undefined): boolean => {
    return planType === "yearly";
  };

  // Helper to get plan price
  const getPlanPrice = (plan: any): number => {
    if (plan.isFree) return 0;
    // Try different possible property names
    return plan.priceMonthly || plan.monthlyPrice || plan.price || 0;
  };

  return (
    <div className="space-y-8">
      {/* Plans Comparison Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Plans & Pricing</CardTitle>
              <CardDescription>
                Choose the perfect plan for your hiring needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const planFeatures = getPlanFeatures(plan);
              const isCurrentPlan = subscription?.planName === plan.name;
              const isPopular = plan.isPopular && !isCurrentPlan;
              const planPrice = getPlanPrice(plan);

              console.log(
                "Plan:",
                plan.name,
                "Price:",
                planPrice,
                "Plan object:",
                plan,
              );

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] ${
                    isCurrentPlan
                      ? "border-blue-300 bg-linear-to-br from-blue-50 to-blue-100/30"
                      : isPopular
                        ? "border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100/30"
                        : "border-slate-200 bg-white"
                  }`}
                >
                  {isPopular && !subscription && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25 px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-linear-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 px-4 py-1">
                        <Check className="h-3 w-3 mr-1" />
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </h3>
                    {!plan.isFree && planPrice > 0 ? (
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-4xl font-bold text-slate-900">
                          ₹{planPrice.toLocaleString()}
                        </span>
                        <span className="text-slate-500 ml-1">/month</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-4xl font-bold text-slate-900">
                          Free
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {planFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            isCurrentPlan
                              ? "bg-linear-to-br from-blue-500 to-blue-600"
                              : isPopular
                                ? "bg-linear-to-br from-emerald-500 to-emerald-600"
                                : "bg-slate-200"
                          }`}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={getPlanButtonVariant(plan.name)}
                    onClick={() => handleUpgradeClick(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full h-12 ${
                      isPopular && !isCurrentPlan
                        ? "bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                        : isCurrentPlan
                          ? "border-blue-300 text-blue-600 hover:bg-blue-50"
                          : ""
                    }`}
                  >
                    {getPlanButtonText(plan.name)}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 rounded-xl bg-linear-to-r from-slate-50 to-slate-100/30 border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">
                  Need a custom plan?
                </h4>
                <p className="text-sm text-slate-600">
                  Contact our sales team for enterprise solutions with custom
                  features.
                </p>
              </div>
              <Button variant="outline" className="border-slate-200">
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Usage Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Current Usage</CardTitle>
              <CardDescription>
                Your current plan usage and limits
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Job Posts
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {subscription?.jobPostsUsed || 0}/
                    {subscription?.jobPostsLimit || 5}
                  </span>
                </div>
                <Progress
                  value={jobPostsPercentage}
                  className="h-2 bg-blue-100"
                />
              </div>
              <div className="text-sm text-slate-600">
                {subscription
                  ? subscription.jobPostsLimit -
                    (subscription.jobPostsUsed || 0)
                  : 5}{" "}
                posts remaining
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Screening Credits
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {subscription?.screeningUsed || 0}/
                    {subscription?.screeningLimit || 0}
                  </span>
                </div>
                <Progress
                  value={screeningPercentage}
                  className="h-2 bg-emerald-100"
                />
              </div>
              <div className="text-sm text-slate-600">
                {subscription
                  ? subscription.screeningLimit -
                    (subscription.screeningUsed || 0)
                  : 0}{" "}
                credits remaining
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Resume Parsing
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    {subscription?.resumeUsed || 0}/
                    {subscription?.resumeLimit || 0}
                  </span>
                </div>
                <Progress
                  value={resumePercentage}
                  className="h-2 bg-amber-100"
                />
              </div>
              <div className="text-sm text-slate-600">
                {subscription
                  ? subscription.resumeLimit - (subscription.resumeUsed || 0)
                  : 0}{" "}
                parses remaining
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    AI Scoring
                  </span>
                  <span className="text-sm font-bold text-violet-600">
                    {subscription?.aiScoreUsed || 0}/
                    {subscription?.aiScoreLimit || 0}
                  </span>
                </div>
                <Progress
                  value={aiScorePercentage}
                  className="h-2 bg-violet-100"
                />
              </div>
              <div className="text-sm text-slate-600">
                {subscription
                  ? subscription.aiScoreLimit - (subscription.aiScoreUsed || 0)
                  : 0}{" "}
                scores remaining
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Billing Cycle</h4>
                <p className="text-sm text-slate-500">
                  {isYearlyPlan(subscription?.planType)
                    ? "Annual billing"
                    : "Monthly billing"}{" "}
                  • Next billing date: {nextBillingDate}
                  {daysRemaining > 0 && ` (${daysRemaining} days remaining)`}
                </p>
              </div>
              <Button variant="outline" className="border-slate-200">
                Change Billing Date
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50/50 border-b border-slate-200/50">
              <div className="text-sm font-medium text-slate-700">Date</div>
              <div className="text-sm font-medium text-slate-700">Plan</div>
              <div className="text-sm font-medium text-slate-700">Amount</div>
              <div className="text-sm font-medium text-slate-700">Status</div>
            </div>

            <div className="divide-y divide-slate-200/50">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50/30 transition-colors"
                >
                  <div className="text-sm text-slate-900">{invoice.date}</div>
                  <div className="text-sm text-slate-700">{invoice.plan}</div>
                  <div className="text-sm font-medium text-slate-900">
                    {invoice.amount}
                  </div>
                  <div>
                    <Badge
                      className={
                        invoice.status === "paid"
                          ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0"
                          : "bg-linear-to-r from-amber-500 to-amber-600 text-white border-0"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-6 rounded-xl bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900">Payment Method</h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {subscription?.paymentReferenceId
                        ? `Payment ID: ${subscription.paymentReferenceId.slice(-4)}`
                        : "No payment method on file"}
                    </p>
                    <p className="text-xs text-blue-700">
                      {subscription?.autoRenew
                        ? "Auto-renewal enabled"
                        : "Manual renewal"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-200">
                  Update Card
                </Button>
                <Button variant="outline" className="border-slate-200">
                  <Download className="h-4 w-4 mr-2" />
                  All Invoices
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">
                  Need help with billing?
                </h4>
                <p className="text-sm text-slate-500">
                  Contact our support team for billing questions
                </p>
              </div>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
