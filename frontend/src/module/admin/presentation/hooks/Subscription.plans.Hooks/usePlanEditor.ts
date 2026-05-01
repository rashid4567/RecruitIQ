
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CreatePlanPayload } from "@/module/admin/application/dto/subscription.plan.dto";
import {
  createPlanUC,

  updatePlanUC,
  getPlanByIdUC
} from "../../di/subscription.plans.di";
export interface PlanFormData extends CreatePlanPayload {
  razorpayPlanId?: string;
}

export function usePlanEditor(id?: string) {
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    planType: "basic",
    price: 0o0,
    currency: "INR",
    billingCycle: "monthly",
    billingInterval: 1,
    jobPostsPerMonth: 10,
    screeningCredits: 50,
    featuresAccess: {
      interviewScheduling: false,
      advancedAnalytics: false,
      prioritySupport: false,
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

  // Load plan for editing
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
            featuresAccess: plan.featuresAccess,
            features: plan.features || [],
            isPopular: plan.isPopular || false,
            description: plan.description || "",
            sortOrder: plan.sortOrder || 1,
            razorpayPlanId: plan.razorpayPlanId || "",
          });
        }
      } catch (err) {
        console.error("Failed to load plan:", err);
        alert("Failed to load plan data");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [id, isEditMode]);

  const handleChange = (field: keyof PlanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFeaturesAccessChange = (
    key: keyof PlanFormData["featuresAccess"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      featuresAccess: { ...prev.featuresAccess, [key]: value },
    }));
  };

  const updateFeature = (index: number, updates: Partial<{ name: string; included: boolean }>) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], ...updates };
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { name: "New Feature", included: true }],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Plan name is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.description?.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

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
          featuresAccess: formData.featuresAccess,
          features: formData.features,
          isPopular: formData.isPopular,
          sortOrder: formData.sortOrder,
          description: formData.description,
          razorpayPlanId: formData.razorpayPlanId,
        });
        alert("Plan updated successfully!");
      } else {
       
        await createPlanUC.execute(formData);
        alert("Plan created successfully!");
      }

      navigate("/admin/plans");
    } catch (error: any) {
      alert(error.message || "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    errors,
    isEditMode,
    handleChange,
    handleFeaturesAccessChange,
    updateFeature,
    addFeature,
    removeFeature,
    handleSave,
  };
}