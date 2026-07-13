import type React from "react";
import { useMemo } from "react";
import {
  Check,
  Briefcase,
  Users,
  Sparkles,
  Zap,
  Shield,
  Target,
  Loader2,
  ArrowRight,
  Rocket,
  Star,
  Crown,
  Building2,
  Calendar,
  BarChart3,
  X,
  CheckCircle2,
} from "lucide-react";

import type { SubscriptionPlan } from "@/module/subscription/types/subscription-plan.types";
import { usePricingPlans } from "@/module/subscription/hooks/subscriptions/usePricingPlans";

type PlanType = "free" | "basic" | "pro" | "enterprise";

const planMeta: Record<
  PlanType,
  {
    icon: React.ElementType;
    accent: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  free: {
    icon: Rocket,
    accent: "#6366f1",
    iconBg: "#ede9fe",
    iconColor: "#6366f1",
  },
  basic: {
    icon: Star,
    accent: "#0ea5e9",
    iconBg: "#e0f2fe",
    iconColor: "#0284c7",
  },
  pro: {
    icon: Crown,
    accent: "#f59e0b",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
  enterprise: {
    icon: Building2,
    accent: "#10b981",
    iconBg: "#d1fae5",
    iconColor: "#059669",
  },
};
function isFreePlan(plan: SubscriptionPlan): boolean {
  return plan.planType === "free";
}

function getDisplayPrice(plan: SubscriptionPlan): {
  amount: string;
  hasMonth: boolean;
} {
  if (isFreePlan(plan)) return { amount: "Free", hasMonth: false };
  const symbol = plan.currency === "INR" ? "₹" : "$";
  return {
    amount: `${symbol}${(plan.price ?? 0).toLocaleString("en-IN")}`,
    hasMonth: true,
  };
}

function getPlanCTA(plan: SubscriptionPlan): string {
  return isFreePlan(plan) ? "Get started free" : "Subscribe now";
}

function getPlanFeatures(
  plan: SubscriptionPlan,
): { text: string; icon: React.ElementType }[] {
  const items: { text: string; icon: React.ElementType }[] = [];

  const jobLabel =
    plan.jobPostsPerMonth === -1
      ? "Unlimited job postings"
      : `${plan.jobPostsPerMonth ?? 0} active job posting${
          (plan.jobPostsPerMonth ?? 0) !== 1 ? "s" : ""
        }`;
  items.push({ text: jobLabel, icon: Briefcase });

  const creditLabel =
    plan.screeningCredits === -1
      ? "Unlimited screening credits"
      : `${plan.screeningCredits ?? 0} screening credits`;
  items.push({ text: creditLabel, icon: Target });

  if (plan.featuresAccess?.advancedAnalytics) {
    items.push({ text: "AI candidate matching", icon: Sparkles });
  } else {
    items.push({ text: "Basic candidate search", icon: Users });
  }

  if (plan.featuresAccess?.prioritySupport) {
    items.push({ text: "Priority support", icon: Zap });
  } else {
    items.push({ text: "Email support", icon: Zap });
  }

  if (plan.featuresAccess?.interviewScheduling) {
    items.push({ text: "Interview scheduling", icon: Calendar });
  }

  if (plan.featuresAccess?.advancedAnalytics) {
    items.push({ text: "Advanced analytics", icon: BarChart3 });
  }

  if (plan.planType === "enterprise") {
    items.push({ text: "SLA support", icon: Shield });
    items.push({ text: "Dedicated account manager", icon: Users });
    items.push({ text: "Custom workflows", icon: Sparkles });
  }

  if (Array.isArray(plan.features) && plan.features.length > 0) {
    const seen = new Set(items.map((i) => i.text.toLowerCase()));
    for (const f of plan.features) {
      if (f.included && !seen.has(f.name.toLowerCase())) {
        items.push({ text: f.name, icon: Check });
        seen.add(f.name.toLowerCase());
      }
    }
  }

  return items.slice(0, 6);
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isPaymentLoading: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  onSubscribe: () => void;
}

function PlanCard({
  plan,
  isSelected,
  isPaymentLoading,
  onSelect,
  onSubscribe,
}: PlanCardProps) {
  const meta = planMeta[plan.planType] ?? planMeta["free"];
  const PlanIcon = meta.icon;
  const features = getPlanFeatures(plan);
  const { amount, hasMonth } = getDisplayPrice(plan);
  const free = isFreePlan(plan);

  return (
    <div
      onClick={() => onSelect(plan)}
      className={[
        "relative flex flex-col rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden",
        "hover:-translate-y-1",
        isSelected
          ? "shadow-lg ring-2 ring-offset-1"
          : "shadow-sm hover:shadow-md",
      ].join(" ")}
      style={
        isSelected
          ? ({
              borderColor: meta.accent,
              "--tw-ring-color": `${meta.accent}40`,
            } as React.CSSProperties)
          : { borderColor: "#e5e7eb" }
      }
    >
      {plan.isPopular && (
        <div
          className="absolute top-0 inset-x-0 py-1.5 text-center text-[10px] font-semibold tracking-widest text-white uppercase"
          style={{ backgroundColor: meta.accent }}
        >
          Most popular
        </div>
      )}

      {!plan.isPopular && (
        <div
          className="h-1 w-full"
          style={{ backgroundColor: meta.accent + "33" }}
        />
      )}

      <div
        className={[
          "flex flex-col flex-1 p-5 gap-5",
          plan.isPopular ? "pt-9" : "",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: meta.iconBg }}
          >
            <PlanIcon className="w-4 h-4" style={{ color: meta.iconColor }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
              {plan.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
              {plan.description}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-gray-900 leading-none">
              {amount}
            </span>
            {hasMonth && (
              <span className="text-xs text-gray-400 font-normal">/mo</span>
            )}
          </div>
          <p
            className="text-[10px] font-medium uppercase tracking-widest mt-1"
            style={{ color: meta.accent }}
          >
            {free ? "Always free" : "Billed monthly"}
          </p>
        </div>

        <div className="border-t border-gray-100" />

        <ul className="flex flex-col gap-2.5 flex-1">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: meta.accent + "18" }}
                >
                  <Icon
                    className="w-2.5 h-2.5"
                    style={{ color: meta.accent }}
                  />
                </span>
                <span className="text-[12px] text-gray-600 leading-snug">
                  {feat.text}
                </span>
              </li>
            );
          })}
        </ul>

        {isSelected ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSubscribe();
            }}
            disabled={isPaymentLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all disabled:opacity-60"
            style={{ backgroundColor: meta.accent }}
          >
            {isPaymentLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Processing…
              </>
            ) : free ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Selected
              </>
            ) : (
              <>
                {getPlanCTA(plan)}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plan);
            }}
            className="w-full py-2.5 rounded-xl text-[13px] font-medium text-gray-600 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {getPlanCTA(plan)}
          </button>
        )}
      </div>
    </div>
  );
}

const DURATION_OPTIONS: {
  months: number;
  label: string;
  badge?: string;
  popular?: boolean;
}[] = [
  { months: 1, label: "1 Month" },
  { months: 3, label: "3 Months" },
  { months: 6, label: "6 Months", badge: "⭐ Most Popular", popular: true },
  { months: 12, label: "12 Months", badge: "💎 Best Value" },
];

function DurationModal({
  plan,
  durationMonths,
  setDurationMonths,
  totalAmount,
  paymentLoading,
  onClose,
  onConfirm,
}: {
  plan: SubscriptionPlan;
  durationMonths: number;
  setDurationMonths: (n: number) => void;
  totalAmount: number;
  paymentLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const meta = planMeta[plan.planType] ?? planMeta["free"];
  const PlanIcon = meta.icon;
  const currencySymbol = plan.currency === "INR" ? "₹" : "$";
  const features = useMemo(() => getPlanFeatures(plan), [plan]);

  const subtotal = (plan.price ?? 0) * durationMonths;
  const discount = Math.max(0, subtotal - totalAmount);

  const formatMoney = (n: number) =>
    `${currencySymbol}${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-4 py-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative px-7 py-6 sm:px-8 text-white shrink-0"
          style={{
            background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <PlanIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">
                Complete your subscription
              </h3>
              <p className="text-sm text-white/80 mt-0.5">
                You're one step away from unlocking {plan.name} features.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-y-auto">
    
          <div className="p-7 sm:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-3">
              Plan Details
            </p>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-bold text-slate-900">
                {plan.name}
              </h4>
              {plan.isPopular && (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: meta.accent }}
                >
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-5">{plan.description}</p>

            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-3">
              Included
            </p>
            <ul className="space-y-2.5">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: meta.accent + "18" }}
                    >
                      <Icon
                        className="w-3 h-3"
                        style={{ color: meta.accent }}
                      />
                    </span>
                    <span className="text-sm text-slate-700 leading-snug">
                      {feat.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: duration + price summary */}
          <div className="p-7 sm:p-8">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-3">
              Choose your billing cycle
            </p>
            <div
              role="radiogroup"
              aria-label="Billing duration"
              className="space-y-2 mb-6"
            >
              {DURATION_OPTIONS.map((opt) => {
                const selected = durationMonths === opt.months;
                return (
                  <button
                    key={opt.months}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDurationMonths(opt.months)}
                    className={[
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                      selected
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          selected ? "border-blue-500" : "border-slate-300",
                        ].join(" ")}
                      >
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {opt.label}
                      </span>
                    </div>
                    {opt.badge && (
                      <span
                        className={[
                          "text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0",
                          opt.popular
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-50 text-emerald-700",
                        ].join(" ")}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-3">
              Price Summary
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {formatMoney(plan.price ?? 0)} × {durationMonths} month
                  {durationMonths !== 1 ? "s" : ""}
                </span>
                <span className="text-slate-700 font-medium">
                  {formatMoney(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="text-emerald-600 font-medium">
                    − {formatMoney(discount)}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatMoney(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Secure payment · No hidden charges · Cancel anytime</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={paymentLoading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={paymentLoading}
                className="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-200 transition-all disabled:opacity-60"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Continue to Secure Payment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingPlans() {
  const {
    plans,
    loading,
    selectedPlanId,
    setSelectedPlanId,
    durationMonths,
    setDurationMonths,
    showDurationModal,
    setShowDurationModal,
    selectedPlan,
    totalAmount,
    paymentLoading,
    openSubscribeModal,
    handleSubscribe,
  } = usePricingPlans();

  if (loading) {
    return (
      <div className="space-y-6">
        <PricingHeader />
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-400">Loading plans…</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="space-y-6">
        <PricingHeader />
        <p className="text-center py-20 text-gray-400 text-sm">
          No plans available. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PricingHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            isPaymentLoading={paymentLoading}
            onSelect={(p) => setSelectedPlanId(p.id)}
            onSubscribe={openSubscribeModal}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-800">
            Upgrade or downgrade anytime
          </p>
          <p className="text-[12px] text-gray-500 mt-0.5">
            All plans include access to our talent database and core recruitment
            features. No hidden fees.
          </p>
        </div>
      </div>

      {showDurationModal && selectedPlan && (
        <DurationModal
          plan={selectedPlan}
          durationMonths={durationMonths}
          setDurationMonths={setDurationMonths}
          totalAmount={totalAmount}
          paymentLoading={paymentLoading}
          onClose={() => setShowDurationModal(false)}
          onConfirm={handleSubscribe}
        />
      )}
    </div>
  );
}

function PricingHeader() {
  return (
    <div className="space-y-8">

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-700">
            RecruitIQ Workspace Setup
          </span>
        </div>

        <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
          Unlock Premium Recruitment
        </h2>

        <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Subscribe to unlock AI-powered candidate screening, interview
          scheduling, analytics, hiring automation, and premium recruitment
          features for your organization.
        </p>
      </div>


      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-5 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
            <Building2 className="h-7 w-7 text-blue-600" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold text-slate-900">
                Complete your recruiter profile
              </h3>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Required before subscription
              </span>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Before activating a subscription, please complete your recruiter
              profile. This allows RecruitIQ to configure your hiring workspace,
              verify your organization, and enable premium recruitment tools.
            </p>

      

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Verify your company
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Personalize your workspace
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Enable AI recruitment tools
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Secure payment & instant activation
                </span>
              </div>
            </div>


            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <ArrowRight className="h-4 w-4 text-blue-600" />

              <p className="text-sm font-medium text-blue-700">
                Once your recruiter profile is complete, you can choose any plan
                below and continue to secure checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
