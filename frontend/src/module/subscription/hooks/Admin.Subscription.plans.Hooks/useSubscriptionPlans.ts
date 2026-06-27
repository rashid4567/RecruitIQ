import type { SubscriptionPlan } from "../../types/subscription-plan.types";
import { useState, useEffect, useCallback } from "react";
import {
  getPlans,
  hidePlan,
  unhidePlan,
} from "../../api/admin-subscription.api";

export interface UIPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingFrequency: string;
  isActive: boolean;
  isRecommended: boolean;
  features: { name: string; included: boolean }[];
  subscriberCount: number;
  mrr: number;
  icon: "zap" | "sparkles" | "crown";
  color: "blue" | "emerald" | "amber";
}

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [uiPlans, setUiPlans] = useState<UIPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const mapToUIPlan = useCallback(
    (plan: SubscriptionPlan): UIPlan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description || "No description available",
      price: plan.price,
      currency: plan.currency,
      billingFrequency: plan.billingCycle,
      isActive: plan.isActive,
      isRecommended: plan.isPopular,
      features: plan.features || [],
      subscriberCount: 0,
      mrr: plan.price * 5,
      icon:
        plan.planType === "enterprise"
          ? "crown"
          : plan.planType === "pro"
            ? "sparkles"
            : "zap",
      color:
        plan.planType === "enterprise"
          ? "amber"
          : plan.planType === "pro"
            ? "emerald"
            : "blue",
    }),
    [],
  );

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPlans({ page: 1, limit: 50 });

      setPlans(result.plans);
      setUiPlans(result.plans.map(mapToUIPlan));
    } catch (err: unknown) {
      console.error("Failed to fetch plans:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load activity logs",
      );
      setUiPlans([]);
    } finally {
      setLoading(false);
    }
  }, [mapToUIPlan]);

  const togglePlanStatus = async (id: string) => {
    setTogglingId(id);
    try {
      const plan = plans.find((p) => p.id === id);
      if (!plan) return;
      if (plan.isActive) {
        await hidePlan(id);
      } else {
        await unhidePlan(id);
      }

      await fetchPlans();
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "Failed to load activity logs",
      );
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const activePlansCount = uiPlans.filter((p) => p.isActive).length;
  const totalMRR = uiPlans.reduce((sum, p) => sum + p.mrr, 0);

  return {
    plans,
    uiPlans,
    loading,
    error,
    activePlansCount,
    totalMRR,
    fetchPlans,
    togglePlanStatus,
    togglingId,
  };
}
