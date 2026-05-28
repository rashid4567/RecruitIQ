import type React from "react";
import { useState, useEffect } from "react";
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
  AlertCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import { useRazorpay } from "../../../../../subscription/presentation/hooks/subscriptions/useRazorpay";
import { ApiSubscriptionPlanRepository } from "@/module/subscription/infrastructure/repositories/ApiSubscriptionPlan.repository";
import { GetAllPlansUseCase } from "@/module/subscription/application/usecase/subscription/GetAllPlansUseCase";


const planMeta: Record<
  string,
  { icon: React.ElementType; accent: string; iconBg: string; iconColor: string }
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



function getDisplayPrice(plan: SubscriptionPlan): {
  amount: string;
  hasMonth: boolean;
} {
  if (plan.isFree) return { amount: "Free", hasMonth: false };
  const symbol = plan.currency === "INR" ? "₹" : "$";
  return {
    amount: `${symbol}${(plan.price ?? 0).toLocaleString("en-IN")}`,
    hasMonth: true,
  };
}

function getPlanCTA(plan: SubscriptionPlan): string {
  return plan.isFree ? "Get started free" : "Subscribe now";
}

function getPlanFeatures(
  plan: SubscriptionPlan
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



interface PricingPlansProps {
  selectedPlan: "free" | "active";
  onPlanSelect: (plan: "free" | "active") => void;
}



interface PlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isPaymentLoading: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
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
            <PlanIcon
              className="w-4 h-4"
              style={{ color: meta.iconColor }}
            />
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
            {plan.isFree ? "Always free" : "Billed monthly"}
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
              if (!plan.isFree) onSubscribe(plan);
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
            ) : plan.isFree ? (
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



export function PricingPlans({ selectedPlan, onPlanSelect }: PricingPlansProps) {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const { isLoading: paymentLoading, initiatePayment } = useRazorpay({
    onSuccess: () => {
      toast.success("Subscription activated successfully!");
      navigate("/recruiter/subscription/success");
    },
    onError: (err) => toast.error(err),
    onDismiss: () => {},
  });


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const repository = new ApiSubscriptionPlanRepository();
        const useCase = new GetAllPlansUseCase(repository);
        const { plans: fetchedPlans } = await useCase.execute({
          activeOnly: false,
        });

        if (!fetchedPlans || fetchedPlans.length === 0) {
          setError("No plans were returned from the server.");
          return;
        }

        const sorted = [...fetchedPlans].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        );
        setPlans(sorted);

        const initial =
          selectedPlan === "free"
            ? (sorted.find((p) => p.isFree) ?? sorted[0])
            : (sorted.find((p) => p.isPopular && !p.isFree) ??
              sorted.find((p) => !p.isFree) ??
              sorted[0]);

        if (initial) setSelectedPlanId(initial.id);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("[PricingPlans] fetch error:", err);
        setError(msg);
        toast.error(`Failed to load plans: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

  }, []);


  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    onPlanSelect(plan.isFree ? "free" : "active");
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.isFree) {
      toast.success("🎉 Free plan activated successfully!");
      navigate("/recruiter/subscription/success");
      return;
    }
    await initiatePayment(plan.id);
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <PricingHeader />
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              Failed to load plans
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
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
            onSelect={handlePlanSelect}
            onSubscribe={handleSubscribe}
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
    </div>
  );
}


function PricingHeader() {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">Choose your plan</h2>
      <p className="text-sm text-gray-500 max-w-lg mx-auto">
        Select the plan that best fits your recruitment needs. All plans include
        access to our talent network.
      </p>
    </div>
  );
}