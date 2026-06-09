import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";
import { getAllPlansUC } from "../../di/subscription.di";
import { useRazorpay } from "./useRazorpay";

export const usePricingPlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [showDurationModal, setShowDurationModal] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Job Posting & Management",
    "Candidate Management",
  ]);

  const { isLoading: paymentLoading, initiatePayment } = useRazorpay({
    onSuccess: () => {
      toast.success("Subscription activated successfully!");
      navigate("/recruiter/subscription/success");
    },
    onError: (err) => {
      toast.error(String(err));
      navigate("/recruiter/subscription/failed");   // ← was missing
    },
    onDismiss: () => {
      toast.info("Payment cancelled");
      // stay on the page — user may want to retry
    },
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getAllPlansUC.execute({ activeOnly: true });
        const sortedPlans = [...response.plans].sort((a, b) => a.sortOrder - b.sortOrder);
        setPlans(sortedPlans);
        const popularPlan = sortedPlans.find((plan) => plan.isPopular) ?? sortedPlans[0];
        if (popularPlan) setSelectedPlanId(popularPlan.id);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
        toast.error("Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId),
    [plans, selectedPlanId],
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const openSubscribeModal = () => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }
    if (selectedPlan.isFree) {
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
      if (selectedPlan.isFree) {
        toast.success("🎉 Free plan activated successfully!");
        navigate("/recruiter/subscription/success");
        return;
      }
      await initiatePayment(selectedPlan.id, durationMonths);
      setShowDurationModal(false);
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process subscription",
      );
      navigate("/recruiter/subscription/failed");  
    }
  };

  const goBack = () => navigate(-1);

  const totalAmount = useMemo(
    () => (selectedPlan ? selectedPlan.price * durationMonths : 0),
    [selectedPlan, durationMonths],
  );

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
    toggleCategory,
    selectedPlan,
    totalAmount,
    paymentLoading,
    openSubscribeModal,
    handleSubscribe,
    goBack,
  };
};