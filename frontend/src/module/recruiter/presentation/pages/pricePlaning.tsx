import { Loader2 } from "lucide-react";
import { usePricingPlans } from "../hooks/subscriptions/usePricingPlans";
import PricingHeader from "./components/Billing/PricingHeader";
import PlanCards from "./components/Billing/PlanCards";
import SelectedPlanDetail from "./components/Billing/SelectedPlanDetail";
import TrustBadges from "./components/Billing/TrustBadges";
import PricingFooter from "./components/Billing/PricingFooter";

export default function PricingPlans() {
  const pricing = usePricingPlans();

  if (pricing.loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/30 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/30 to-white">
      <PricingHeader
        billingCycle={pricing.billingCycle}
        setBillingCycle={pricing.setBillingCycle}
      />
      <PlanCards
        plans={pricing.plans}
        selectedPlanId={pricing.selectedPlanId}
        setSelectedPlanId={pricing.setSelectedPlanId}
        billingCycle={pricing.billingCycle}
      />
      {pricing.selectedPlan && (
        <SelectedPlanDetail
          selectedPlan={pricing.selectedPlan}
          plans={pricing.plans}
          billingCycle={pricing.billingCycle}
          paymentLoading={pricing.paymentLoading}
          expandedCategories={pricing.expandedCategories}
          toggleCategory={pricing.toggleCategory}
          handleSubscribe={pricing.handleSubscribe}
        />
      )}
      <TrustBadges />
      <PricingFooter />
    </div>
  );
}
