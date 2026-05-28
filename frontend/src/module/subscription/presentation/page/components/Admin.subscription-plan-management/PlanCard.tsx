
import { Pencil, Crown, Sparkles, Zap, Check, X } from 'lucide-react';
import type { UIPlan } from '../../../hooks/Admin.Subscription.plans.Hooks/useSubscriptionPlans';
import { useNavigate } from 'react-router-dom';

interface PlanCardProps {
  plan: UIPlan;
  onToggle: (id: string) => void;

 
  togglingId: string | null;
}

const colorMap = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
};

export default function PlanCard({ plan, onToggle, togglingId }: PlanCardProps) {
  const navigate = useNavigate();

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-2xl ${plan.isRecommended ? 'border-2 border-amber-200 shadow-xl shadow-amber-500/20' : 'border-zinc-200 hover:border-zinc-300'}`}>

      {plan.isRecommended && (
        <div className="absolute -right-12 top-6 rotate-45 bg-linear-to-r from-amber-500 to-amber-600 px-12 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
          Popular
        </div>
      )}

      <div className="p-6 pb-0">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${colorMap[plan.color]}`}>
            {plan.icon === "crown" && <Crown className="h-6 w-6 text-white" />}
            {plan.icon === "sparkles" && <Sparkles className="h-6 w-6 text-white" />}
            {plan.icon === "zap" && <Zap className="h-6 w-6 text-white" />}
          </div>


          <button
            onClick={() => onToggle(plan.id)}
            disabled={togglingId === plan.id}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all disabled:opacity-50 ${plan.isActive ? 'bg-linear-to-r from-emerald-500 to-emerald-600' : 'bg-zinc-200'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${plan.isActive ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-zinc-900">{plan.name}</h3>
            {!plan.isActive && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">Inactive</span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 line-clamp-2">
            {plan.description}
          </p>
        </div>

        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-zinc-900">
            ₹{plan.price.toLocaleString()}
          </span>
          <span className="text-base font-medium text-zinc-400">/{plan.billingFrequency}</span>
        </div>
      </div>

      <div className="flex-1 p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">WHAT'S INCLUDED</p>
        <div className="space-y-3">
          {plan.features.slice(0, 5).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100">
                  <X className="h-3 w-3 text-zinc-400" />
                </div>
              )}
              <span className={`text-sm ${feature.included ? 'text-zinc-700' : 'text-zinc-400 line-through'}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 border-t border-zinc-100 p-4">
        <button
          onClick={() => navigate(`/admin/plans/edit/${plan.id}`)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white hover:brightness-110 transition-all"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
    </div>
  );
}