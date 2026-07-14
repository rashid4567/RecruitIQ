import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

import { PlanType } from "@/module/subscription/constant/subscription.constants";
import type {
  PlanFeature,
  SubscriptionPlan,
} from "@/module/subscription/types/subscription-plan.types";

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onUpgrade: (planId: string) => void;
}

function getButtonVariant(isCurrentPlan: boolean): "default" | "outline" {
  return isCurrentPlan ? "outline" : "default";
}

function getFeatureLabel(feature: PlanFeature): string {
  return feature.name;
}

export function PlanCard({
  plan,
  isCurrentPlan,
  onUpgrade,
}: PlanCardProps) {
  const isPopular = plan.isPopular && !isCurrentPlan;
  const isFreePlan = plan.planType === PlanType.Free;

  return (
    <div
      className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] ${
        isCurrentPlan
          ? "border-blue-300 bg-linear-to-br from-blue-50 to-blue-100/30"
          : isPopular
            ? "border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100/30"
            : "border-slate-200 bg-white"
      }`}
    >
      {isPopular && (
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

        {isFreePlan ? (
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-slate-900">
              Free
            </span>
          </div>
        ) : (
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-slate-900">
              ₹{plan.price.toLocaleString()}
            </span>
            <span className="text-slate-500 ml-1">
              /{plan.billingCycle.toLowerCase()}
            </span>
          </div>
        )}

        {plan.description && (
          <p className="text-sm text-slate-500 mt-2">
            {plan.description}
          </p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center ${
                isCurrentPlan
                  ? "bg-linear-to-br from-blue-500 to-blue-600"
                  : isPopular
                    ? "bg-linear-to-br from-emerald-500 to-emerald-600"
                    : "bg-slate-300"
              }`}
            >
              <Check className="h-3 w-3 text-white" />
            </div>

            <span className="text-sm text-slate-700">
              {getFeatureLabel(feature)}
            </span>
          </div>
        ))}
      </div>

      <Button
        variant={getButtonVariant(isCurrentPlan)}
        disabled={isCurrentPlan}
        onClick={() => onUpgrade(plan.id)}
        className={`w-full h-12 ${
          isPopular
            ? "bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
            : isCurrentPlan
              ? "border-blue-300 text-blue-600 hover:bg-blue-50"
              : ""
        }`}
      >
        {isCurrentPlan
          ? "Current Plan"
          : isFreePlan
            ? "Get Started"
            : "Upgrade Now"}
      </Button>
    </div>
  );
}