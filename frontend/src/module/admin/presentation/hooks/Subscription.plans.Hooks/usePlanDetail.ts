import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { SubscriptionPlan } from "@/module/admin/domain/entities/subscription-plan.entity";
import {
  getPlansUC,
  updatePlanUC,
  hidePlanUC,
  unhidePlanUC,
} from "../../di/subscription.plans.di";
import type { UpdatePlanPayload } from "@/module/admin/application/dto/subscription.plan.dto";

interface UsePlanDetailReturn {
  plan: SubscriptionPlan | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  refetch: () => Promise<void>;
  updatePlan: (payload: UpdatePlanPayload) => Promise<void>;
  hidePlan: () => Promise<void>;
  unhidePlan: () => Promise<void>;
  toggleVisibility: () => Promise<void>;
}

export function usePlanDetail(planId: string | undefined): UsePlanDetailReturn {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ─── Fetch single plan ─────────────────────────────────────────────────────
  const fetchPlan = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getPlansUC.execute({ planId });
      setPlan(res.plans?.[0] ?? null);
    } catch (err: any) {
      const msg = err?.message ?? "Failed to load plan.";
      setError(msg);
      toast.error("Failed to load plan", { description: msg });
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  // ─── Generic action runner (mirrors runAction in useRecruiterProfile) ──────
  const runAction = async (
    action: () => Promise<void>,
    optimisticUpdate?: () => SubscriptionPlan
  ) => {
    if (!plan || !planId) return;
    setActionLoading(true);

    // Apply optimistic update immediately so UI feels instant
    if (optimisticUpdate) setPlan(optimisticUpdate());

    try {
      await action();
      // Refetch to get the real server state
      const res = await getPlansUC.execute({ planId });
      setPlan(res.plans?.[0] ?? null);
    } catch (err: any) {
      const msg = err?.message ?? "Action failed. Please try again.";
      setError(msg);
      toast.error("Action failed", { description: msg });
      // Rollback to real server state on failure
      await fetchPlan();
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Actions ───────────────────────────────────────────────────────────────
  const updatePlan = (payload: UpdatePlanPayload) =>
    runAction(async () => {
      await updatePlanUC.execute(planId!, payload);
      toast.success("Plan updated successfully");
    });

  const hidePlan = () =>
    runAction(
      async () => {
        await hidePlanUC.execute(planId!);
        toast.success(`"${plan?.name}" is now hidden`);
      },
      () => plan!.withActiveStatus(false) as SubscriptionPlan
    );

  const unhidePlan = () =>
    runAction(
      async () => {
        await unhidePlanUC.execute(planId!);
        toast.success(`"${plan?.name}" is now visible`);
      },
      () => plan!.withActiveStatus(true) as SubscriptionPlan
    );

  const toggleVisibility = () =>
    plan?.isActive ? hidePlan() : unhidePlan();

  return {
    plan,
    loading,
    error,
    actionLoading,
    refetch: fetchPlan,
    updatePlan,
    hidePlan,
    unhidePlan,
    toggleVisibility,
  };
}