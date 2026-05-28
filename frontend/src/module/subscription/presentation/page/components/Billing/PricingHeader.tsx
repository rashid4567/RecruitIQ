import { Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface Props {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}
export default function PricingHeader({
  billingCycle,
  setBillingCycle,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

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

          <div className="mt-10 inline-flex items-center bg-white shadow-sm border border-slate-200 p-1.5 rounded-full">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly
              <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
