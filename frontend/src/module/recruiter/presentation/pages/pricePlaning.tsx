  "use client";

  import { useState, useEffect, useMemo } from "react";

  import {
    Check,
    X,
    Shield,
    Target,
    Zap,
    Crown,
    Rocket,
    Building2,
    ArrowRight,
    Star,
    ChevronDown,
    Headphones,
    Lock,
    BarChart3,
    FileText,
    MessageSquare,
    Webhook,
    Users,
    Loader2,
  } from "lucide-react";
  import { toast } from "sonner";

  import type { SubscriptionPlan } from "@/module/recruiter/Domain/entities/SubscriptionPlan.entity";
  import { ApiSubscriptionPlanRepository } from "../../infrastructure/repositories/ApiSubscriptionPlan.repository";
  import { GetAllPlansUseCase } from "../../Application/use-Cases/subscription/GetAllPlansUseCase";
  import { useRazorpay } from "../hooks/subscriptions/useRazorpay";
  import { useNavigate, useRouteError } from "react-router-dom";

  // ─── Helper Functions ─────────────────────────────────────────────────────────

  function getDisplayPrice(plan: SubscriptionPlan, yearly: boolean): string {
    if (plan.isFree) return "Free";
    const monthly = plan.price ?? 0;
    const price = yearly ? Math.round(monthly * 0.8) : monthly;
    const symbol = plan.currency === "INR" ? "₹" : "$";
    return `${symbol}${price.toLocaleString("en-IN")}`;
  }

  function getYearlyTotal(plan: SubscriptionPlan): string {
    if (plan.isFree) return "";
    const monthly = plan.price ?? 0;
    const symbol = plan.currency === "INR" ? "₹" : "$";
    const yearly = Math.round(monthly * 0.8 * 12);
    return `${symbol}${yearly.toLocaleString("en-IN")}/year`;
  }

  function getDisplayJobPosts(plan: SubscriptionPlan): string {
    if (plan.jobPostsPerMonth === -1) return "Unlimited";
    return (plan.jobPostsPerMonth ?? 0).toString();
  }

  function getDisplayScreeningCredits(plan: SubscriptionPlan): string {
    if (plan.screeningCredits === -1) return "Unlimited";
    return (plan.screeningCredits ?? 0).toString();
  }

  function getPlanCTA(plan: SubscriptionPlan): string {
    if (plan.isFree) return "Get Started Free";
    
    return "Subscribe Now";
  }

  // ─── Plan Icons ───────────────────────────────────────────────────────────────

  const planIcons: Record<string, React.ElementType> = {
    free: Rocket,
    basic: Star,
    pro: Crown,
    enterprise: Building2,
  };

  // ─── Feature Categories ───────────────────────────────────────────────────────

  interface FeatureCategoryRow {
    category: string;
    features: {
      name: string;
      values: Record<string, string | boolean>;
    }[];
  }

  function buildFeatureCategories(plans: SubscriptionPlan[]): FeatureCategoryRow[] {
    return [
      {
        category: "Job Posting & Management",
        features: [
          { name: "Active Job Postings", values: Object.fromEntries(plans.map((p) => [p.id, getDisplayJobPosts(p)])) },
          { name: "Multi-location Posting", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
          { name: "Custom Application Forms", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
          { name: "Scheduled Posting", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
        ],
      },
      {
        category: "Candidate Management",
        features: [
          { name: "Screening Credits", values: Object.fromEntries(plans.map((p) => [p.id, getDisplayScreeningCredits(p)])) },
          { name: "AI Candidate Matching", values: Object.fromEntries(plans.map((p) => [p.id, p.featuresAccess?.advancedAnalytics ?? false])) },
          { name: "Advanced Search Filters", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
          { name: "Candidate Scoring", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
        ],
      },
      {
        category: "Communication & Collaboration",
        features: [
          {
            name: "Interview Scheduling",
            values: Object.fromEntries(plans.map((p) => [p.id, p.featuresAccess?.interviewScheduling ? (p.planType === "enterprise" ? "Automated + Calendar Sync" : "Automated") : "Manual"])),
          },
          {
            name: "Team Collaboration",
            values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "free" ? false : p.planType === "enterprise" ? "Unlimited" : "Up to 10"])),
          },
          { name: "In-app Messaging", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
          { name: "Video Interview", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
        ],
      },
      {
        category: "Analytics & Reporting",
        features: [
          { name: "Basic Analytics", values: Object.fromEntries(plans.map((p) => [p.id, true])) },
          { name: "Advanced Reports", values: Object.fromEntries(plans.map((p) => [p.id, p.featuresAccess?.advancedAnalytics ?? false])) },
          { name: "Custom Dashboards", values: Object.fromEntries(plans.map((p) => [p.id, p.featuresAccess?.advancedAnalytics ?? false])) },
          { name: "DEI Reporting", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "enterprise"])) },
        ],
      },
      {
        category: "Security & Compliance",
        features: [
          { name: "SSL Encryption", values: Object.fromEntries(plans.map((p) => [p.id, true])) },
          { name: "GDPR Compliance", values: Object.fromEntries(plans.map((p) => [p.id, true])) },
          { name: "Two-Factor Auth", values: Object.fromEntries(plans.map((p) => [p.id, p.planType !== "free"])) },
          { name: "SSO (SAML/OIDC)", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "enterprise"])) },
          { name: "Audit Logs", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "free" ? false : p.planType === "enterprise" ? "Unlimited" : "30 days"])) },
        ],
      },
      {
        category: "Integration & API",
        features: [
          { name: "API Access", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "free" ? false : p.planType === "enterprise" ? "Full Access" : "Read-only"])) },
          { name: "Webhooks", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "free" ? false : p.planType === "enterprise" ? "Unlimited" : "5"])) },
          { name: "Custom Integrations", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "enterprise"])) },
          { name: "White-label Options", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "enterprise"])) },
        ],
      },
      {
        category: "Support & Services",
        features: [
          { name: "Email Support", values: Object.fromEntries(plans.map((p) => [p.id, true])) },
          { name: "Priority Support", values: Object.fromEntries(plans.map((p) => [p.id, p.featuresAccess?.prioritySupport ?? false])) },
          { name: "Phone Support", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "enterprise"])) },
          { name: "Response Time", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "free" ? "48 hours" : p.planType === "enterprise" ? "1 hour SLA" : "4 hours"])) },
          { name: "Dedicated Account Manager", values: Object.fromEntries(plans.map((p) => [p.id, p.planType === "enterprise"])) },
        ],
      },
    ];
  }

  // ─── Category Icons ───────────────────────────────────────────────────────────

  const categoryIcons: Record<string, React.ElementType> = {
    "Job Posting & Management": FileText,
    "Candidate Management": Users,
    "Communication & Collaboration": MessageSquare,
    "Analytics & Reporting": BarChart3,
    "Security & Compliance": Lock,
    "Integration & API": Webhook,
    "Support & Services": Headphones,
  };

  const trustBadges = [
    { icon: Shield, title: "Enterprise Security", desc: "SOC 2 Type II certified" },
    { icon: Zap, title: "99.9% Uptime", desc: "Guaranteed availability" },
    { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
    { icon: Target, title: "Smart Matching", desc: "AI-powered recommendations" },
  ];

  // ─── Main Component ───────────────────────────────────────────────────────────

  export default function PricingPlans() {
    const navigate = useNavigate();

    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [expandedCategories, setExpandedCategories] = useState<string[]>([
      "Job Posting & Management",
      "Candidate Management",
    ]);

    // ✅ Fix 4: useRouter — navigate to success page after payment
    const { isLoading: paymentLoading, initiatePayment } = useRazorpay({
      onSuccess: () => {
        toast.success("Subscription activated successfully!");
        navigate("/recruiter/subscription/success");
      },
      onError: (err) => {
        toast.error(err);
      },
      onDismiss: () => {},
    });

    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const repository = new ApiSubscriptionPlanRepository();
          const useCase = new GetAllPlansUseCase(repository);

          const response = await useCase.execute();
          const sorted = [...response.plans].sort((a, b) => a.sortOrder - b.sortOrder);

          setPlans(sorted);
          const popular = sorted.find((p) => p.isPopular) ?? sorted[0];
          if (popular) setSelectedPlanId(popular.id);
        } catch (error) {
          console.error("Failed to load subscription plans:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPlans();
    }, []);

    // ✅ Fix 5 & 6: useMemo for both expensive derived values
    const featureCategories = useMemo(() => buildFeatureCategories(plans), [plans]);

    const selectedPlan = useMemo(
      () => plans.find((p) => p.id === selectedPlanId),
      [plans, selectedPlanId],
    );

    const toggleCategory = (category: string) => {
      setExpandedCategories((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
      );
    };

    const handleSubscribe = async () => {
      if (!selectedPlan) return;
      if (selectedPlan.isFree) {
        toast.success("🎉 Free plan activated successfully!");
        navigate("/recruiter/subscription/success");
        return;
      }
    
      await initiatePayment(selectedPlan.id);
    };

    const renderFeatureValue = (value: string | boolean, planId: string) => {
      if (typeof value === "boolean") {
        return value ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <X className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        );
      }
      return (
        <span className={`text-sm font-medium ${planId === selectedPlanId ? "text-blue-700" : "text-slate-700"}`}>
          {value}
        </span>
      );
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-slate-500 text-sm">Loading plans...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">

        {/* Header */}
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Choose Your Plan
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include access to our extensive talent network.
            </p>

            <div className="mt-10 inline-flex items-center bg-white shadow-sm border border-slate-200 p-1.5 rounded-full">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingCycle === "yearly" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Yearly
                <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = planIcons[plan.planType] ?? Rocket;
                const isSelected = selectedPlanId === plan.id;
                const isHighlighted = plan.isPopular;
                const displayPrice = getDisplayPrice(plan, billingCycle === "yearly");

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative rounded-2xl text-left transition-all duration-300 ${isHighlighted ? "lg:-mt-4 lg:mb-4" : ""} ${
                      isSelected ? "ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]" : "shadow-lg hover:shadow-xl hover:scale-[1.01]"
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className={`rounded-2xl p-6 lg:p-8 h-full ${isHighlighted ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white" : "bg-white border border-slate-200"}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHighlighted ? "bg-white/20" : "bg-blue-50"}`}>
                          <Icon className={`w-6 h-6 ${isHighlighted ? "text-white" : "text-blue-600"}`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${isHighlighted ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                          <p className={`text-sm ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}>
                            {plan.isFree ? "Get started for free" : plan.isPopular ? "Most popular choice" : "For large organizations"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-4xl font-bold tracking-tight ${isHighlighted ? "text-white" : "text-slate-900"}`}>{displayPrice}</span>
                          {!plan.isFree && <span className={`text-base ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}>/month</span>}
                        </div>
                        {billingCycle === "yearly" && !plan.isFree && (
                          <p className={`text-sm mt-1 ${isHighlighted ? "text-blue-200" : "text-slate-500"}`}>Billed annually ({getYearlyTotal(plan)})</p>
                        )}
                      </div>

                      <ul className="space-y-2.5 mb-6">
                        {plan.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isHighlighted ? "bg-white/20" : feature.included ? "bg-emerald-100" : "bg-slate-100"}`}>
                              {feature.included ? <Check className={`w-3 h-3 ${isHighlighted ? "text-white" : "text-emerald-600"}`} /> : <X className={`w-3 h-3 ${isHighlighted ? "text-white/50" : "text-slate-400"}`} />}
                            </div>
                            <span className={`text-sm ${isHighlighted ? "text-blue-50" : feature.included ? "text-slate-600" : "text-slate-400"}`}>{feature.name}</span>
                          </li>
                        ))}
                      </ul>

                      <div className={`py-3 rounded-xl text-center font-semibold text-sm transition-all ${isSelected ? (isHighlighted ? "bg-white text-blue-700" : "bg-blue-600 text-white") : isHighlighted ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {isSelected ? "Selected — View Details Below" : "Click to Select"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Plan Detail */}
        {selectedPlan && (
          <div className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

                {/* Detail Header */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                        {(() => {
                          const Icon = planIcons[selectedPlan.planType] ?? Rocket;
                          return <Icon className="w-8 h-8 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedPlan.name} Plan Details</h2>
                        <p className="text-slate-300 mt-1 max-w-lg">{selectedPlan.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{getDisplayPrice(selectedPlan, billingCycle === "yearly")}</span>
                        {!selectedPlan.isFree && <span className="text-slate-400">/month</span>}
                      </div>

                      <div className="flex gap-3">
                        <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{getDisplayJobPosts(selectedPlan)} job posts</span>
                        <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{getDisplayScreeningCredits(selectedPlan)} screening credits</span>
                      </div>

                      <button
                        onClick={handleSubscribe}
                        disabled={paymentLoading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all w-full md:w-auto justify-center"
                      >
                        {paymentLoading ? (
                          <> <Loader2 className="w-4 h-4 animate-spin" /> Processing... </>
                        ) : (
                          <> {getPlanCTA(selectedPlan)} <ArrowRight className="w-4 h-4" /> </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {selectedPlan.featuresAccess?.interviewScheduling && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-300">✓ Interview Scheduling</span>
                    )}
                    {selectedPlan.featuresAccess?.advancedAnalytics && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-300">✓ Advanced Analytics</span>
                    )}
                    {selectedPlan.featuresAccess?.prioritySupport && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-300">✓ Priority Support</span>
                    )}
                  </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Complete Feature Comparison</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setExpandedCategories(featureCategories.map((c) => c.category))} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Expand All</button>
                      <span className="text-slate-300">|</span>
                      <button onClick={() => setExpandedCategories([])} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Collapse All</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {featureCategories.map((category) => {
                      const CategoryIcon = categoryIcons[category.category] ?? Shield;
                      const isExpanded = expandedCategories.includes(category.category);

                      return (
                        <div key={category.category} className="border border-slate-200 rounded-xl overflow-hidden">
                          <button onClick={() => toggleCategory(category.category)} className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <CategoryIcon className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-semibold text-slate-900">{category.category}</span>
                              <span className="text-sm text-slate-500">({category.features.length} features)</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>

                          {isExpanded && (
                            <div className="divide-y divide-slate-100">
                              {category.features.map((feature, idx) => (
                                <div key={idx} className="px-5 py-4 hover:bg-slate-50/50" style={{ display: "grid", gridTemplateColumns: `1fr repeat(${plans.length}, 1fr)`, gap: "1rem", alignItems: "center" }}>
                                  <div className="text-sm text-slate-700 font-medium">{feature.name}</div>

                                  <div className="md:hidden col-span-full grid gap-2" style={{ gridTemplateColumns: `repeat(${plans.length}, 1fr)` }}>
                                    {plans.map((plan) => (
                                      <div key={plan.id} className={`text-center p-2 rounded-lg ${selectedPlanId === plan.id ? "bg-blue-50 border border-blue-200" : "bg-slate-50"}`}>
                                        <div className="text-xs text-slate-500 mb-1">{plan.name}</div>
                                        {renderFeatureValue(feature.values[plan.id], plan.id)}
                                      </div>
                                    ))}
                                  </div>

                                  {plans.map((plan) => (
                                    <div key={plan.id} className={`hidden md:flex justify-center items-center ${selectedPlanId === plan.id ? "bg-blue-50/50 -mx-2 px-2 rounded-lg" : ""}`}>
                                      {renderFeatureValue(feature.values[plan.id], plan.id)}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Footer */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-white">Ready to get started with {selectedPlan.name}?</h3>
                      <p className="text-blue-100 mt-1">
                        {selectedPlan.isFree ? "Get started for free — no credit card required" : "Subscribe now and unlock premium features"}
                      </p>
                    </div>
                    <button
                      onClick={handleSubscribe}
                      disabled={paymentLoading}
                      className="bg-white hover:bg-blue-50 disabled:bg-slate-200 text-blue-700 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg whitespace-nowrap"
                    >
                      {paymentLoading ? (
                        <> <Loader2 className="w-5 h-5 animate-spin" /> Processing... </>
                      ) : (
                        <> {getPlanCTA(selectedPlan)} <ArrowRight className="w-5 h-5" /> </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">{badge.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-slate-600">
              Have questions? <a href="#" className="text-blue-600 font-medium hover:text-blue-700 underline underline-offset-4">Check our FAQ</a> or{" "}
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700 underline underline-offset-4">contact our sales team</a>
            </p>
          </div>
        </div>

      </div>
    );
  }