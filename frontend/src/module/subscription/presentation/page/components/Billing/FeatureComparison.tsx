import { ChevronDown, Check, X, Shield } from "lucide-react";
import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import { buildFeatureCategories, categoryIcons } from "./Pricing.utils";

interface Props {
  plans: SubscriptionPlan[];
  expandedCategories: string[];
  toggleCategory: (category: string) => void;
}

export default function FeatureComparison({
  plans,
  expandedCategories,
  toggleCategory,
}: Props) {
  const featureCategories = buildFeatureCategories(plans);

  const renderFeatureValue = (
    value: string | boolean,
    planId: string,
    selectedPlanId: string,
  ) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      );
    }
    return (
      <span
        className={`text-sm font-medium ${planId === selectedPlanId ? "text-blue-700" : "text-slate-700"}`}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Complete Feature Comparison
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {}}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Expand All
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => {}}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {featureCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.category);
          const CategoryIcon = categoryIcons[category.category] ?? Shield;

          return (
            <div
              key={category.category}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CategoryIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-900">
                    {category.category}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({category.features.length} features)
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="divide-y divide-slate-100">
                  {category.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="px-5 py-4 hover:bg-slate-50/50 grid"
                      style={{
                        gridTemplateColumns: `1fr repeat(${plans.length}, 1fr)`,
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <div className="text-sm text-slate-700 font-medium">
                        {feature.name}
                      </div>

                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`hidden md:flex justify-center items-center ${plan.id === plans[0].id ? "bg-blue-50/50 -mx-2 px-2 rounded-lg" : ""}`}
                        >
                          {renderFeatureValue(
                            feature.values[plan.id],
                            plan.id,
                            plans[0].id,
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
