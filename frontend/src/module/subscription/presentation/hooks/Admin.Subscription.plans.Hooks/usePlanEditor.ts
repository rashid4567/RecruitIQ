import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CreatePlanPayload } from "@/module/admin/application/dto/subscription.plan.dto";
import axios from "axios";
import { createPlanUC, getPlanByIdUC, updatePlanUC } from "../../di/admin.subscription.plans.di";

export interface PlanFormData extends CreatePlanPayload {
  razorpayPlanId?: string;
  resumeParsesPerMonth: number;
  aiScoreCredits: number;
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ??
      err.response?.data?.error ??
      "No internet connection. Please check your network and try again."
    );
  }
  return "No internet connection. Please check your network and try again.";
}

function validatePlanForm(formData: PlanFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name?.trim()) {
    errors.name = "Plan name is required.";
  } else if (formData.name.trim().length < 3) {
    errors.name = "Plan name must be at least 3 characters.";
  } else if (formData.name.trim().length > 50) {
    errors.name = "Plan name must be 50 characters or less.";
  }

  if (!formData.description?.trim()) {
    errors.description = "Description is required.";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  } else if (formData.description.trim().length > 300) {
    errors.description = "Description must be 300 characters or less.";
  }

  if (formData.planType !== "free") {
    if (formData.price === undefined || formData.price === null) {
      errors.price = "Price is required.";
    } else if (isNaN(Number(formData.price))) {
      errors.price = "Price must be a valid number.";
    } else if (Number(formData.price) <= 0) {
      errors.price = "Price must be greater than 0.";
    } else if (Number(formData.price) > 1_000_000) {
      errors.price = "Price seems too high. Please double-check.";
    }
  }

  if (!formData.billingInterval || formData.billingInterval < 1) {
    errors.billingInterval = "Billing interval must be at least 1.";
  } else if (formData.billingInterval > 12) {
    errors.billingInterval = "Billing interval cannot exceed 12 months.";
  }

  if (formData.jobPostsPerMonth === undefined || formData.jobPostsPerMonth < -1) {
    errors.jobPostsPerMonth = "Job posts per month cannot be lesser than -1.";
  } else if (formData.jobPostsPerMonth > 10_000) {
    errors.jobPostsPerMonth = "Job posts per month seems too high.";
  }

  if (formData.screeningCredits === undefined || formData.screeningCredits < -1) {
    errors.screeningCredits = "Screening credits cannot be lesser than -1.";
  } else if (formData.screeningCredits > 100_000) {
    errors.screeningCredits = "Screening credits seems too high.";
  }

  if (formData.resumeParsesPerMonth === undefined || formData.resumeParsesPerMonth < -1) {
    errors.resumeParsesPerMonth = "Resume parses per month cannot be lesser than -1.";
  } else if (formData.resumeParsesPerMonth > 100_000) {
    errors.resumeParsesPerMonth = "Resume parses per month seems too high.";
  }

  if (formData.aiScoreCredits === undefined || formData.aiScoreCredits < -1) {
    errors.aiScoreCredits = "AI score credits cannot be lesser than -1.";
  } else if (formData.aiScoreCredits > 100_000) {
    errors.aiScoreCredits = "AI score credits seems too high.";
  }

  if (formData.sortOrder === undefined || formData.sortOrder < 1) {
    errors.sortOrder = "Sort order must be at least 1.";
  }

  if (!formData.features || formData.features.length === 0) {
    errors.features = "At least one feature is required.";
  } else {
    const hasEmptyFeature = formData.features.some((f) => !f.name?.trim());
    if (hasEmptyFeature) {
      errors.features = "All feature names must be filled in.";
    }
  }

  if (formData.planType !== "free" && !formData.razorpayPlanId?.trim()) {
    errors.razorpayPlanId = "Razorpay Plan ID is required for paid plans.";
  }

  return errors;
}

export function usePlanEditor(id?: string) {
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    planType: "basic",
    price: 0,
    currency: "INR",
    billingCycle: "monthly",
    billingInterval: 1,
    jobPostsPerMonth: 10,
    screeningCredits: 50,
    resumeParsesPerMonth: 10,
    aiScoreCredits: 10,
    featuresAccess: {
      interviewScheduling: false,
      advancedAnalytics: false,
      prioritySupport: false,
      aiResumeScoring: false,
      resumeParsing: false,
      candidateShortlisting: false,
      exportReports: false,
    },
    features: [
      { name: "AI Candidate Matching", included: true },
      { name: "Priority Support", included: true },
      { name: "Interview Scheduling", included: false },
      { name: "Advanced Analytics", included: false },
    ],
    isPopular: false,
    description: "",
    sortOrder: 1,
    razorpayPlanId: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadPlan = async () => {
      setLoading(true);
      try {
        const plan = await getPlanByIdUC.execute(id);
        if (plan) {
          setFormData({
            name: plan.name,
            planType: plan.planType,
            price: plan.price,
            currency: plan.currency,
            billingCycle: plan.billingCycle,
            billingInterval: plan.billingInterval,
            jobPostsPerMonth: plan.jobPostsPerMonth,
            screeningCredits: plan.screeningCredits,
            resumeParsesPerMonth: plan.resumeParsesPerMonth,
            aiScoreCredits: plan.aiScoreCredits,
            featuresAccess: plan.featuresAccess,
            features: plan.features || [],
            isPopular: plan.isPopular || false,
            description: plan.description || "",
            sortOrder: plan.sortOrder || 1,
            razorpayPlanId: plan.razorpayPlanId || "",
          });
        }
      } catch (err) {
        setSaveError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [id, isEditMode]);

  const handleChange = <K extends keyof PlanFormData>(
    field: K,
    value: PlanFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (saveError) setSaveError(null);
  };

  const handleFeaturesAccessChange = (
    key: keyof PlanFormData["featuresAccess"],
    value: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      featuresAccess: { ...prev.featuresAccess, [key]: value },
    }));
  };

  const updateFeature = (
    index: number,
    updates: Partial<{ name: string; included: boolean }>,
  ) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], ...updates };
    setFormData((prev) => ({ ...prev, features: updated }));
    if (errors.features) setErrors((prev) => ({ ...prev, features: "" }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { name: "", included: true }],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    const validationErrors = validatePlanForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      if (isEditMode && id) {
        await updatePlanUC.execute(id, {
          name: formData.name,
          price: formData.price,
          currency: formData.currency,
          billingCycle: formData.billingCycle,
          billingInterval: formData.billingInterval,
          jobPostsPerMonth: formData.jobPostsPerMonth,
          screeningCredits: formData.screeningCredits,
          resumeParsesPerMonth: formData.resumeParsesPerMonth,
          aiScoreCredits: formData.aiScoreCredits,
          featuresAccess: formData.featuresAccess,
          features: formData.features,
          isPopular: formData.isPopular,
          sortOrder: formData.sortOrder,
          description: formData.description,
          razorpayPlanId: formData.razorpayPlanId,
        });
      } else {
        await createPlanUC.execute(formData);
      }

      setSaveSuccess(true);
      setTimeout(() => navigate("/admin/plans"), 1500);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    errors,
    saveError,
    saveSuccess,
    isEditMode,
    handleChange,
    handleFeaturesAccessChange,
    updateFeature,
    addFeature,
    removeFeature,
    handleSave,
  };
}