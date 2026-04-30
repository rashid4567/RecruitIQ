import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import type { SubscriptionPlan } from "@/module/admin/domain/entities/subscription-plan.entity";
import {
  getPlansUC,
  createPlanUC,
  hidePlanUC,
  unhidePlanUC,
} from "../../di/subscription.plans.di";
import type { CreatePlanPayload } from "@/module/admin/application/dto/subscription.plan.dto";

type FilterTab = "all" | "active" | "hidden";

export function usePlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [tab, setTab] = useState<FilterTab>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query: Record<string, unknown> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (debouncedSearch) query.search = debouncedSearch;
      if (tab === "active") query.isActive = true;
      if (tab === "hidden") query.isActive = false;

      const res = await getPlansUC.execute(query);

      setPlans(res.plans ?? []);
      setPagination((p) => ({
        ...p,
        total: res.total ?? 0,
        totalPages: res.total ? Math.ceil(res.total / p.limit) : 1,
      }));
    } catch (err: any) {
      const msg = err?.message || "Failed to load plans";
      setError(msg);
      toast.error("Failed to load plans", { description: msg });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, tab]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // ─── Action runner ─────────────────────────────────────────────────────────
  const performAction = async (plan: SubscriptionPlan, action: string) => {
    const id = plan.id;
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      switch (action) {
        case "hide":
          await hidePlanUC.execute(id);
          toast.success(`"${plan.name}" is now hidden`);
          break;

        case "unhide":
          await unhidePlanUC.execute(id);
          toast.success(`"${plan.name}" is now visible`);
          break;

        case "delete":
          await hidePlanUC.execute(id);
          toast.success(`"${plan.name}" has been deleted`);
          break;

        case "duplicate": {
          const payload: CreatePlanPayload = {
            name: `${plan.name} (Copy)`,
            planType: plan.planType,
            price: plan.price,
            currency: plan.currency,
            billingCycle: plan.billingCycle,
            billingInterval: plan.billingInterval,
            jobPostsPerMonth: plan.jobPostsPerMonth,
            screeningCredits: plan.screeningCredits,
            featuresAccess: { ...plan.featuresAccess },
            features: [...plan.features],
            isPopular: false,
            sortOrder: plan.sortOrder + 1,
            description: plan.description,
          };
          await createPlanUC.execute(payload);
          toast.success(`"${plan.name}" duplicated successfully`);
          break;
        }
      }

      await fetchPlans();
    } catch (err: any) {
      toast.error(err?.message || "Action failed. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return {
    plans,
    loading,
    error,
    search,
    setSearch,
    tab,
    setTab,
    pagination,
    setPagination,
    actionLoading,
    performAction,
    fetchPlans,
  };
}