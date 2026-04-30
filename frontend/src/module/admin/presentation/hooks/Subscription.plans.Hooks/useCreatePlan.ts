import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { SubscriptionPlan } from "@/module/admin/domain/entities/subscription-plan.entity";
import { createPlanUC } from "../../di/subscription.plans.di";
import type { CreatePlanPayload } from "@/module/admin/application/dto/subscription.plan.dto";

interface UseCreatePlanReturn {
  loading: boolean;
  error: string | null;
  createPlan: (payload: CreatePlanPayload) => Promise<SubscriptionPlan | null>;
  clearError: () => void;
}

export function useCreatePlan(): UseCreatePlanReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlan = useCallback(
    async (payload: CreatePlanPayload): Promise<SubscriptionPlan | null> => {
      setLoading(true);
      setError(null);

      const toastId = toast.loading("Creating plan...");

      try {
        const created = await createPlanUC.execute(payload);
        toast.success("Plan created", {
          id: toastId,
          description: `"${created.name}" has been created successfully.`,
        });
        return created;
      } catch (err: any) {
        const msg = err?.message ?? "Failed to create plan.";
        setError(msg);
        toast.error("Failed to create plan", { id: toastId, description: msg });
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, createPlan, clearError };
}