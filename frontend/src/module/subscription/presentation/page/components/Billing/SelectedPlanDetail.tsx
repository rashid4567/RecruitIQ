import { ArrowRight, Loader2 } from "lucide-react";
import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import {
  getDisplayPrice,
  getDisplayJobPosts,
  getDisplayScreeningCredits,
  getPlanCTA,
} from "./Pricing.utils";
import FeatureComparison from "./FeatureComparison";

interface Props {
  selectedPlan: SubscriptionPlan;
  plans: SubscriptionPlan[];
  billingCycle: "monthly" | "yearly";
  paymentLoading: boolean;
  expandedCategories: string[];
  toggleCategory: (category: string) => void;
  handleSubscribe: () => void;
}

export default function SelectedPlanDetail({
  selectedPlan,
  plans,
  billingCycle,
  paymentLoading,
  expandedCategories,
  toggleCategory,
  handleSubscribe,
}: Props) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 text-white">★</div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedPlan.name} Plan Details
                  </h2>

                  <p className="text-slate-300 mt-1 max-w-lg">
                    {selectedPlan.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {getDisplayPrice(
                      selectedPlan,
                      billingCycle === "yearly",
                    )}
                  </span>

                  {!selectedPlan.isFree && (
                    <span className="text-slate-400">/month</span>
                  )}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                    {getDisplayJobPosts(selectedPlan)} Job Posts
                  </span>

                  <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                    {getDisplayScreeningCredits(selectedPlan)} Screening Credits
                  </span>

                  {!selectedPlan.isFree && (
                    <span className="bg-green-500/20 text-green-200 text-xs px-3 py-1 rounded-full">
                      Choose 1–12 Months
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={paymentLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all w-full md:w-auto justify-center"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {getPlanCTA(selectedPlan)}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <FeatureComparison
            plans={plans}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
          />

          {/* Footer CTA */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white">
                  Ready to get started with {selectedPlan.name}?
                </h3>

                <p className="text-blue-100 mt-1">
                  {selectedPlan.isFree
                    ? "Get started for free — no credit card required"
                    : "Subscribe now and choose your preferred duration"}
                </p>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={paymentLoading}
                className="bg-white hover:bg-blue-50 disabled:bg-slate-200 text-blue-700 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg whitespace-nowrap"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {getPlanCTA(selectedPlan)}
                    <ArrowRight className="w-5 h-5" />
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