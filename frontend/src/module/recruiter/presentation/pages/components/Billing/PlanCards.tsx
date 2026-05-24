import { Rocket, Star, Crown, Building2, Check, X } from "lucide-react";
import type { SubscriptionPlan } from "@/module/recruiter/Domain/entities/SubscriptionPlan.entity";
import { getDisplayPrice, getYearlyTotal } from "./Pricing.utils";

const planIcons: Record<string, React.ElementType> = {
  free: Rocket,
  basic: Star,
  pro: Crown,
  enterprise: Building2,
};

interface Props {
  plans: SubscriptionPlan[];
  selectedPlanId: string;
  setSelectedPlanId: (id: string) => void;
  billingCycle: "monthly" | "yearly";
}

export default function PlanCards({
  plans,
  selectedPlanId,
  setSelectedPlanId,
  billingCycle,
}: Props) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = planIcons[plan.planType] ?? Rocket;
            const isSelected = selectedPlanId === plan.id;
            const isHighlighted = plan.isPopular;
            const displayPrice = getDisplayPrice(
              plan,
              billingCycle === "yearly",
            );

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-2xl text-left transition-all duration-300 ${isHighlighted ? "lg:-mt-4 lg:mb-4" : ""} ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]"
                    : "shadow-lg hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                    <span className="bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-2xl p-6 lg:p-8 h-full ${isHighlighted ? "bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 text-white" : "bg-white border border-slate-200"}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHighlighted ? "bg-white/20" : "bg-blue-50"}`}
                    >
                      <Icon
                        className={`w-6 h-6 ${isHighlighted ? "text-white" : "text-blue-600"}`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${isHighlighted ? "text-white" : "text-slate-900"}`}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={`text-sm ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}
                      >
                        {plan.isFree
                          ? "Get started for free"
                          : plan.isPopular
                            ? "Most popular choice"
                            : "For large organizations"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-bold tracking-tight ${isHighlighted ? "text-white" : "text-slate-900"}`}
                      >
                        {displayPrice}
                      </span>
                      {!plan.isFree && (
                        <span
                          className={`text-base ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}
                        >
                          /month
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && !plan.isFree && (
                      <p
                        className={`text-sm mt-1 ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}
                      >
                        Billed annually ({getYearlyTotal(plan)})
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isHighlighted ? "bg-white/20" : feature.included ? "bg-emerald-100" : "bg-slate-100"}`}
                        >
                          {feature.included ? (
                            <Check
                              className={`w-3 h-3 ${isHighlighted ? "text-white" : "text-emerald-600"}`}
                            />
                          ) : (
                            <X
                              className={`w-3 h-3 ${isHighlighted ? "text-white/50" : "text-slate-400"}`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm ${isHighlighted ? "text-blue-50" : feature.included ? "text-slate-600" : "text-slate-400"}`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`py-3 rounded-xl text-center font-semibold text-sm transition-all ${isSelected ? (isHighlighted ? "bg-white text-blue-700" : "bg-blue-600 text-white") : isHighlighted ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {isSelected
                      ? "Selected — View Details Below"
                      : "Click to Select"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
