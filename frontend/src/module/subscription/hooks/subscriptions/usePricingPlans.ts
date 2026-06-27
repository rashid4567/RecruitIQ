import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { SubscriptionPlan } from "../../types/subscription-plan.types";
import { findActivePlans } from "../../api/subscription-plan.api";
import { useRazorpay } from "./useRazorpay";

export const usePricingPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [durationMonths, setDurationMonths] = useState(1);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Job Posting & Management",
    "Candidate Management",
  ]);

  const { isLoading: paymentLoading, initiatePayment } = useRazorpay({
    onSuccess: () => {
      toast.success("Subscription activated successfully!");
      navigate("/recruiter/subscription/success");
    },
    onError: (error) => {
      toast.error(String(error));
      navigate("/recruiter/subscription/failed");
    },
    onDismiss: () => {
      toast.info("Payment cancelled");
    },
  });

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const data = await findActivePlans();
        const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
        setPlans(sorted);
        const defaultPlan = sorted.find((plan) => plan.isPopular) ?? sorted[0];
        if (defaultPlan) {
          setSelectedPlanId(defaultPlan.id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    );
  };

  const openSubscribeModal = () => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }
    if (selectedPlan.planType === "free") {
      handleSubscribe();
      return;
    }
    setShowDurationModal(true);
  };

  const handleSubscribe = async () => {
    try {
      if (!selectedPlan) {
        toast.error("Please select a subscription plan");
        return;
      }
      if (durationMonths < 1 || durationMonths > 12) {
        toast.error("Subscription duration must be between 1 and 12 months");
        return;
      }

      if (selectedPlan.planType === "free") {
        toast.success("🎉 Free plan activated successfully!");
        navigate("/recruiter/subscription/success");
        return;
      }
      await initiatePayment(selectedPlan.id, durationMonths);
      setShowDurationModal(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process subscription",
      );
      navigate("/recruiter/subscription/failed");
    }
  };
  const totalAmount = useMemo(() => {
    if (!selectedPlan) {
      return 0;
    }
    return selectedPlan.price * durationMonths;
  }, [selectedPlan, durationMonths]);
  const goBack = () => navigate(-1);

  return {
    plans,
    loading,
    selectedPlanId,
    setSelectedPlanId,
    billingCycle,
    setBillingCycle,
    durationMonths,
    setDurationMonths,
    showDurationModal,
    setShowDurationModal,
    expandedCategories,
    setExpandedCategories,
    selectedPlan,
    totalAmount,
    paymentLoading,
    toggleCategory,
    openSubscribeModal,
    handleSubscribe,
    goBack,
  };
};
