"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Pencil,
  ChevronRight,
  Check,
  X,
  Calendar,
  Briefcase,
  Brain,
  Star,
  ShieldCheck,
  BarChart2,
  Clock,
} from "lucide-react";

import Sidebar from "@/components/admin/sideBar";
import type {
  CreatePlanPayload,
  UpdatePlanPayload,
} from "@/module/admin/application/dto/subscription.plan.dto";
import { Toggle } from "../components/subscription-plan-management/Toggle";
import { CollapsibleSection } from "../components/subscription-plan-management/CollapsibleSection";

export default function PlanEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreatePlanPayload>({
    name: "",
    planType: "basic",
    price: 999,
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
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load Plan (Edit Mode)
  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadPlan = async () => {
      setLoading(true);
      try {
        const { GetPlanByIdUseCase } = await import(
          "../../application/useCases/subscription.management/get-plan-by-id.usecase"
        );
        const { ApiSubscriptionPlanRepository } = await import(
          "../../infrastructure/repositories/Api-subscription.plan.repository"
        );

        const repo = new ApiSubscriptionPlanRepository();
        const useCase = new GetPlanByIdUseCase(repo);
        const plan = await useCase.execute(id);

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
            featuresAccess: {
              interviewScheduling: plan.featuresAccess.interviewScheduling,
              advancedAnalytics: plan.featuresAccess.advancedAnalytics,
              prioritySupport: plan.featuresAccess.prioritySupport,
            },
            features: plan.features || [],
            isPopular: plan.isPopular || false,
            description: plan.description || "",
            sortOrder: plan.sortOrder || 1,
          });
        }
      } catch (error) {
        console.error("Failed to load plan:", error);
        alert("Failed to load plan data");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [id, isEditMode]);

  const handleChange = (field: keyof CreatePlanPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFeaturesAccessChange = (
    key: keyof CreatePlanPayload["featuresAccess"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      featuresAccess: { ...prev.featuresAccess, [key]: value },
    }));
  };

  const updateFeature = (
    index: number,
    updates: Partial<{ name: string; included: boolean }>
  ) => {
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
    if (!formData.description?.trim())
      newErrors.description = "Please add a description";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const repo = new (
        await import(
          "../../infrastructure/repositories/Api-subscription.plan.repository"
        )
      ).ApiSubscriptionPlanRepository();

      if (isEditMode && id) {
        const { UpdatePlanUseCase } = await import(
          "../../application/useCases/subscription.management/update-plan.usecase"
        );
        const useCase = new UpdatePlanUseCase(repo);

        const updatePayload: UpdatePlanPayload = {
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
        };

        await useCase.execute(id, updatePayload);
        alert("Plan updated successfully!");
      } else {
        const { CreatePlanUseCase } = await import(
          "../../application/useCases/subscription.management/create-plan.usecase"
        );
        const useCase = new CreatePlanUseCase(repo);
        await useCase.execute(formData);
        alert("Plan created successfully!");
      }

      navigate("/admin/plans");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500 font-medium">Loading plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-[200px] min-h-screen pb-20">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
          <div className="flex h-14 items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/plans")}
                className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Plans
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-5 py-2 rounded-xl border border-zinc-300 text-sm font-medium hover:bg-zinc-50">
                Preview Plan
              </button>
              <button
                onClick={() => navigate("/admin/plans")}
                className="px-5 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
              >
                <Save className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Plan"
                  : "Create Plan"}
              </button>
            </div>
          </div>
        </header>

        <div className="px-8 py-6">
          {/* Breadcrumb + Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                Plans <ChevronRight className="h-4 w-4" />{" "}
                {isEditMode ? "Edit" : "Create"} Plan
              </div>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-3xl font-bold text-zinc-900">
                  {formData.name ||
                    (isEditMode ? "Edit Plan" : "New Subscription Plan")}
                </h1>
                {isEditMode && (
                  <button className="text-zinc-400 hover:text-zinc-600">
                    <Pencil className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1.5 text-xs font-medium rounded-full ${
                  formData.isPopular
                    ? "bg-amber-100 text-amber-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {formData.isPopular ? "Popular Plan" : "Standard"}
              </span>
            </div>
          </div>

          {/* Warning Banner */}
          {isEditMode && (
            <div className="mb-8 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Important Note</p>
                <p className="text-sm text-amber-700 mt-1">
                  Any changes to pricing or features will only apply to existing
                  subscribers from their next billing cycle.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Basic Details */}
              <CollapsibleSection title="Basic Details" defaultOpen>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                        errors.name ? "border-red-500" : "border-zinc-300"
                      }`}
                      placeholder="Professional Plan"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      rows={4}
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                      placeholder="Describe what this plan offers to recruiters..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Plan Type
                      </label>
                      <select
                        value={formData.planType}
                        onChange={(e) =>
                          handleChange("planType", e.target.value)
                        }
                        className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
                      >
                        <option value="basic">Basic</option>
                        <option value="pro">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleChange("price", parseInt(e.target.value) || 0)
                        }
                        className={`w-full rounded-xl border px-4 py-3 focus:border-indigo-500 ${
                          errors.price ? "border-red-500" : "border-zinc-300"
                        }`}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Billing Configuration — NEW */}
              <CollapsibleSection title="Billing Configuration">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-zinc-400" />
                          Billing Cycle
                        </span>
                      </label>
                      <select
                        value={formData.billingCycle}
                        onChange={(e) =>
                          handleChange("billingCycle", e.target.value)
                        }
                        className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-zinc-400" />
                          Billing Interval
                        </span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formData.billingInterval}
                        onChange={(e) =>
                          handleChange(
                            "billingInterval",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
                      />
                      <p className="text-xs text-zinc-400 mt-1">
                        e.g. 1 = every 1 month
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 focus:border-indigo-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  {/* Razorpay Plan ID */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Razorpay Plan ID
                      {formData.planType !== "free" && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.razorpayPlanId || ""}
                      onChange={(e) =>
                        handleChange("razorpayPlanId", e.target.value)
                      }
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 font-mono text-sm focus:border-indigo-500"
                      placeholder="plan_XXXXXXXXXXXX"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                      Required for all non-free plans
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Limits & Quotas */}
              <CollapsibleSection title="Limits & Quotas">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 mb-2 block">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-zinc-400" />
                        Job Posts per Month
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formData.jobPostsPerMonth}
                      onChange={(e) =>
                        handleChange(
                          "jobPostsPerMonth",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                      Use -1 for unlimited
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700 mb-2 block">
                      <span className="flex items-center gap-1.5">
                        <Brain className="h-4 w-4 text-zinc-400" />
                        AI Screening Credits
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formData.screeningCredits}
                      onChange={(e) =>
                        handleChange(
                          "screeningCredits",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                      Use -1 for unlimited
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Features Access — NEW */}
              <CollapsibleSection title="Feature Access Controls">
                <p className="text-sm text-zinc-500 mb-5">
                  Control which premium capabilities this plan unlocks for subscribers.
                </p>
                <div className="space-y-4">
                  {/* Interview Scheduling */}
                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">
                          Interview Scheduling
                        </p>
                        <p className="text-xs text-zinc-500">
                          Allow automated interview booking with candidates
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={formData.featuresAccess.interviewScheduling}
                      onChange={() =>
                        handleFeaturesAccessChange(
                          "interviewScheduling",
                          !formData.featuresAccess.interviewScheduling
                        )
                      }
                    />
                  </div>

                  {/* Advanced Analytics */}
                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                        <BarChart2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">
                          Advanced Analytics
                        </p>
                        <p className="text-xs text-zinc-500">
                          Detailed hiring funnel metrics and reports
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={formData.featuresAccess.advancedAnalytics}
                      onChange={() =>
                        handleFeaturesAccessChange(
                          "advancedAnalytics",
                          !formData.featuresAccess.advancedAnalytics
                        )
                      }
                    />
                  </div>

                  {/* Priority Support */}
                  <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                        <ShieldCheck className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">
                          Priority Support
                        </p>
                        <p className="text-xs text-zinc-500">
                          Dedicated support with faster response times
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={formData.featuresAccess.prioritySupport}
                      onChange={() =>
                        handleFeaturesAccessChange(
                          "prioritySupport",
                          !formData.featuresAccess.prioritySupport
                        )
                      }
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Features List Management */}
              <CollapsibleSection title="Features Management">
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    <Plus className="h-4 w-4" /> Add New Feature
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl p-4 group"
                    >
                      <GripVertical className="h-5 w-5 text-zinc-400 cursor-grab" />

                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) =>
                          updateFeature(index, { name: e.target.value })
                        }
                        className="flex-1 bg-transparent border-0 focus:outline-none font-medium text-zinc-900"
                      />

                      <button
                        onClick={() =>
                          updateFeature(index, {
                            included: !feature.included,
                          })
                        }
                        className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                          feature.included
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {feature.included ? "Included" : "Excluded"}
                      </button>

                      <button
                        onClick={() => removeFeature(index)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              {/* Plan Preview */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h3 className="font-semibold text-zinc-900 mb-4">
                  Plan Preview
                </h3>
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6">
                  {formData.isPopular && (
                    <div className="inline-block mb-3 px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="text-5xl font-bold text-zinc-900 mb-1">
                    ₹{formData.price.toLocaleString()}
                  </div>
                  <p className="text-zinc-500">per {formData.billingCycle}</p>

                  <div className="my-6 h-px bg-zinc-200" />

                  <h4 className="font-semibold mb-4">
                    {formData.name || "Plan Name"}
                  </h4>

                  {formData.description && (
                    <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                      {formData.description}
                    </p>
                  )}

                  <ul className="space-y-3 text-sm text-zinc-600">
                    {formData.features.slice(0, 6).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                        )}
                        <span className={f.included ? "" : "text-zinc-400 line-through"}>
                          {f.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Feature access badges */}
                  {(formData.featuresAccess.interviewScheduling ||
                    formData.featuresAccess.advancedAnalytics ||
                    formData.featuresAccess.prioritySupport) && (
                    <div className="mt-5 pt-4 border-t border-zinc-200">
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                        Premium Access
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.featuresAccess.interviewScheduling && (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                            <Calendar className="h-3 w-3" />
                            Scheduling
                          </span>
                        )}
                        {formData.featuresAccess.advancedAnalytics && (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                            <BarChart2 className="h-3 w-3" />
                            Analytics
                          </span>
                        )}
                        {formData.featuresAccess.prioritySupport && (
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                            <ShieldCheck className="h-3 w-3" />
                            Priority Support
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Settings */}
              <CollapsibleSection title="Plan Settings">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-700 font-medium flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-amber-500" />
                        Mark as Popular Plan
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Highlights this plan with a "Popular" badge
                      </p>
                    </div>
                    <Toggle
                      checked={formData.isPopular ?? false}
                      onChange={() =>
                        handleChange("isPopular", !formData.isPopular)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        handleChange(
                          "sortOrder",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                      Lower number = displayed first
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Quota Summary */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="font-semibold text-zinc-900 mb-4 text-sm">
                  Quota Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-500">
                      <Briefcase className="h-4 w-4" /> Job Posts / Month
                    </span>
                    <span className="font-semibold text-zinc-800">
                      {formData.jobPostsPerMonth === -1
                        ? "Unlimited"
                        : formData.jobPostsPerMonth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-500">
                      <Brain className="h-4 w-4" /> Screening Credits
                    </span>
                    <span className="font-semibold text-zinc-800">
                      {formData.screeningCredits === -1
                        ? "Unlimited"
                        : formData.screeningCredits}
                    </span>
                  </div>
                  <div className="h-px bg-zinc-100 my-1" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-500">
                      <Calendar className="h-4 w-4" /> Interview Scheduling
                    </span>
                    {formData.featuresAccess.interviewScheduling ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-500">
                      <BarChart2 className="h-4 w-4" /> Advanced Analytics
                    </span>
                    {formData.featuresAccess.advancedAnalytics ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-zinc-500">
                      <ShieldCheck className="h-4 w-4" /> Priority Support
                    </span>
                    {formData.featuresAccess.prioritySupport ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-zinc-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-[200px] right-0 border-t border-zinc-200 bg-white px-8 py-4 flex justify-end gap-4 z-40">
          <button
            onClick={() => navigate("/admin/plans")}
            className="px-6 py-2.5 text-zinc-700 font-medium hover:bg-zinc-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : isEditMode ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </main>
    </div>
  );
}