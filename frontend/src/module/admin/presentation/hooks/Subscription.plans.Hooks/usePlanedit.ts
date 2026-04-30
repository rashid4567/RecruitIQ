"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getPlanByIdUC,
  updatePlanUC,
  hidePlanUC,
  unhidePlanUC,
} from "../../di/subscription.plans.di";
import type {
  BillingCycle,
  Currency,
  FeaturesAccess,
  PlanFeature,
  PlanType,
  SubscriptionPlanProps,
} from "@/module/admin/domain/entities/subscription-plan.entity";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type EffectiveDate = "immediately" | "next-billing";

export interface PlanFormState {
  name: string;
  description: string;
  planType: PlanType;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingInterval: number;
  jobPostsPerMonth: number;
  screeningCredits: number;
  featuresAccess: FeaturesAccess;
  features: PlanFeature[];
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  razorpayPlanId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapper
// ─────────────────────────────────────────────────────────────────────────────

function planToFormState(plan: SubscriptionPlanProps): PlanFormState {
  return {
    name: plan.name,
    description: plan.description ?? "",
    planType: plan.planType,
    price: plan.price,
    currency: plan.currency,
    billingCycle: plan.billingCycle,
    billingInterval: plan.billingInterval,
    jobPostsPerMonth: plan.jobPostsPerMonth,
    screeningCredits: plan.screeningCredits,
    featuresAccess: { ...plan.featuresAccess },
    features: plan.features.map((f) => ({ ...f })),
    isPopular: plan.isPopular,
    sortOrder: plan.sortOrder,
    isActive: plan.isActive,
    razorpayPlanId: plan.razorpayPlanId ?? "",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function usePlanEdit(planId: string) {
  const [form, setForm] = useState<PlanFormState | null>(null);
  const [originalPlan, setOriginalPlan] = useState<SubscriptionPlanProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState<EffectiveDate>("next-billing");

  // ── Load plan ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!planId) return;
    setLoading(true);
    const toastId = toast.loading("Loading plan details…");

    getPlanByIdUC
      .execute(planId)
      .then((plan) => {
        if (!plan) {
          toast.error("Plan not found", { id: toastId });
          return;
        }
        const primitives = plan.toPrimitives();
        setOriginalPlan(primitives);
        setForm(planToFormState(primitives));
        toast.dismiss(toastId);
      })
      .catch((err: any) => {
        toast.error(err?.message ?? "Failed to load plan", { id: toastId });
      })
      .finally(() => setLoading(false));
  }, [planId]);

  // ── Generic field setter ───────────────────────────────────────────────────
  const handleChange = useCallback(
    <K extends keyof PlanFormState>(key: K, value: PlanFormState[K]) => {
      setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    [],
  );

  // ── FeaturesAccess toggle ──────────────────────────────────────────────────
  const handleFeaturesAccessChange = useCallback(
    (key: keyof FeaturesAccess, value: boolean) => {
      setForm((prev) =>
        prev
          ? { ...prev, featuresAccess: { ...prev.featuresAccess, [key]: value } }
          : prev,
      );
    },
    [],
  );

  // ── Feature list ───────────────────────────────────────────────────────────
  const handleFeatureToggle = useCallback((index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        features: prev.features.map((f, i) =>
          i === index ? { ...f, included: !f.included } : f,
        ),
      };
    });
  }, []);

  const handleFeatureNameChange = useCallback((index: number, name: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        features: prev.features.map((f, i) =>
          i === index ? { ...f, name } : f,
        ),
      };
    });
  }, []);

  const addFeature = useCallback(() => {
    setForm((prev) =>
      prev
        ? { ...prev, features: [...prev.features, { name: "", included: true }] }
        : prev,
    );
  }, []);

  const removeFeature = useCallback((index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const featureName = prev.features[index]?.name;
      toast.info(`"${featureName || "Feature"}" removed`);
      return { ...prev, features: prev.features.filter((_, i) => i !== index) };
    });
  }, []);

  // ── Toggle active via API ──────────────────────────────────────────────────
  const handleToggleActive = useCallback(async () => {
    if (!form || !planId) return;
    const toastId = toast.loading(
      form.isActive ? "Hiding plan…" : "Activating plan…",
    );
    try {
      if (form.isActive) {
        await hidePlanUC.execute(planId);
        toast.success("Plan is now hidden", { id: toastId });
      } else {
        await unhidePlanUC.execute(planId);
        toast.success("Plan is now active", { id: toastId });
      }
      setForm((prev) => (prev ? { ...prev, isActive: !prev.isActive } : prev));
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update plan status", { id: toastId });
    }
  }, [form, planId]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!form || !planId) return;

    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error("Plan name must be at least 2 characters");
      return;
    }
    if (form.price < 0) {
      toast.error("Price cannot be negative");
      return;
    }
    if (form.planType !== "free" && !form.razorpayPlanId.trim()) {
      toast.error("Razorpay Plan ID is required for paid plans");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving changes…");

    try {
      await updatePlanUC.execute(planId, {
        name: form.name.trim(),
        description: form.description,
        price: form.price,
        currency: form.currency,
        billingCycle: form.billingCycle,
        billingInterval: form.billingInterval,
        jobPostsPerMonth: form.jobPostsPerMonth,
        screeningCredits: form.screeningCredits,
        featuresAccess: form.featuresAccess,
        features: form.features,
        isPopular: form.isPopular,
        sortOrder: form.sortOrder,
        razorpayPlanId: form.razorpayPlanId.trim() || undefined,
      });

      // Sync original so isDirty resets to false
      setOriginalPlan((prev) =>
        prev
          ? { ...prev, ...form, razorpayPlanId: form.razorpayPlanId || undefined }
          : prev,
      );

      toast.success("Plan saved successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save plan", { id: toastId });
    } finally {
      setSaving(false);
    }
  }, [form, planId]);

  // ── Discard ────────────────────────────────────────────────────────────────
  const handleDiscard = useCallback(() => {
    if (!originalPlan) return;
    setForm(planToFormState(originalPlan));
    toast.info("Changes discarded");
  }, [originalPlan]);

  // ── Dirty check ────────────────────────────────────────────────────────────
  const isDirty =
    JSON.stringify(form) !==
    JSON.stringify(originalPlan ? planToFormState(originalPlan) : null);

  return {
    form,
    loading,
    saving,
    isDirty,
    effectiveDate,
    setEffectiveDate,
    handleChange,
    handleFeaturesAccessChange,
    handleFeatureToggle,
    handleFeatureNameChange,
    addFeature,
    removeFeature,
    handleToggleActive,
    handleSave,
    handleDiscard,
  };
}