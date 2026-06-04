import { Loader2 } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import { useCurrentSubscription } from "@/module/subscription/presentation/hooks/subscriptions/useCurrentSubscription";
import { usePricingPlans } from "@/module/subscription/presentation/hooks/subscriptions/usePricingPlans";
import { PlansComparisonCard } from "../components/Billing.section/PlansComparisonCard";
import { CurrentUsageCard } from "../components/Billing.section/CurrentUsageCard";

function computeNextBillingDate(endDate: Date | undefined): string {
  if (!endDate) return "N/A";
  return new Date(endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function computeDaysRemaining(endDate: Date | undefined): number {
  if (!endDate) return 0;
  return Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

export function BillingSection() {
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useCurrentSubscription();
  const {
    plans,
    loading: plansLoading,
    handleSubscribe,
    setSelectedPlanId,
  } = usePricingPlans();

  const subscription = subscriptionData?.subscription as
    | RecruiterSubscription
    | undefined;

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

  const nextBillingDate = computeNextBillingDate(subscription?.endDate);
  const daysRemaining = computeDaysRemaining(subscription?.endDate);

  return (
    <div className="space-y-8">
      <PlansComparisonCard
        plans={plans}
        currentPlanName={subscription?.planName}
        onUpgrade={handleUpgradeClick}
      />
      <CurrentUsageCard
        subscription={subscription}
        nextBillingDate={nextBillingDate}
        daysRemaining={daysRemaining}
      />
    </div>
  );
}
