
import { Check, Briefcase, Users, Sparkles, Zap, Shield, Target } from "lucide-react";

const plans = [
  {
    id: "free" as const,
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for individual recruiters starting out",
    features: [
      { text: "1 Active Job Posting", icon: Briefcase },
      { text: "Basic Candidate Search", icon: Users },
      { text: "Email Support", icon: Zap },
      { text: "Access to Talent Pool", icon: Target },
    ],
    button: "Get Started Free",
    subscriptionStatus: "free" as const,
    highlighted: false,
  },
  {
    id: "active" as const,
    name: "Professional",
    price: "$59",
    period: "/month",
    description: "Best for growing recruitment teams",
    features: [
      { text: "Unlimited Job Posts", icon: Briefcase },
      { text: "Advanced Candidate Filters", icon: Users },
      { text: "AI Candidate Matching", icon: Sparkles },
      { text: "Priority Support", icon: Zap },
      { text: "14-Day Free Trial", icon: Check },
    ],
    button: "Start Free Trial",
    subscriptionStatus: "active" as const,
    highlighted: true,
  },
  {
    id: "active" as const,
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "Complete recruitment solution for enterprises",
    features: [
      { text: "All Professional Features", icon: Check },
      { text: "Dedicated Account Manager", icon: Users },
      { text: "Custom Workflows", icon: Sparkles },
      { text: "API Access", icon: Zap },
      { text: "SLA Support", icon: Shield },
    ],
    button: "Contact Sales",
    subscriptionStatus: "active" as const,
    highlighted: false,
  },
];

interface PricingPlansProps {
  selectedPlan: "free" | "active";
  onPlanSelect: (plan: "free" | "active") => void;
}

export function PricingPlans({ selectedPlan, onPlanSelect }: PricingPlansProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Choose Your Plan</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Select the plan that best fits your recruitment needs. All plans include access to our talent network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            onClick={() => onPlanSelect(plan.id)}
            className={`relative rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 border ${
              selectedPlan === plan.id
                ? "border-blue-500 shadow-2xl ring-4 ring-blue-500/20 bg-white"
                : plan.highlighted
                ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-600 text-sm mt-2">{plan.description}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-lg text-slate-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
                  {plan.subscriptionStatus.toUpperCase()}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                {plan.features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span className="text-[15px] text-slate-700 leading-tight">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlanSelect(plan.id);
                }}
                className={`w-full py-3.5 rounded-2xl font-semibold mt-6 transition-all ${
                  selectedPlan === plan.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {selectedPlan === plan.id ? "✓ Selected" : plan.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Check className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-900">You can upgrade or downgrade anytime</p>
            <p className="text-slate-600 mt-1">All plans come with access to our talent database and core features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}