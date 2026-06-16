import { Star, ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

export default function PricingHeader({}: Props) {
  const navigate = useNavigate();

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={() => navigate("/recruiter/current-subscription")}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all"
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
            Current Subscription
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Simple, transparent pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
            Choose Your Plan
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include access to our
            extensive talent network.
          </p>
        </div>
      </div>
    </div>
  );
}
