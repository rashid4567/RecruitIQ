import {
  Shield,
  Mail,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Crown,
  AlertCircle,
  ArrowUpRight,
  Zap,
} from "lucide-react";

interface AccountInfoCardProps {
  email: string;
  subscriptionStatus?: string;
  onEmailUpdateClick: () => void;
  onUpgradeClick?: () => void;
}

type PlanKey = "free" | "active" | "expired";

const planConfig: Record<
  PlanKey,
  {
    label: string;
    sublabel: string;
    color: string;
    bg: string;
    border: string;
    gradientFrom: string;
    gradientTo: string;
    icon: React.ElementType;
    dot: string;
  }
> = {
  free: {
    label: "Free Plan",
    sublabel: "Basic access",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    gradientFrom: "from-slate-50",
    gradientTo: "to-slate-100/60",
    icon: Sparkles,
    dot: "bg-slate-400",
  },
  active: {
    label: "Premium",
    sublabel: "All features unlocked",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    gradientFrom: "from-emerald-50",
    gradientTo: "to-emerald-100/40",
    icon: Crown,
    dot: "bg-emerald-500",
  },
  expired: {
    label: "Expired",
    sublabel: "Renewal required",
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    gradientFrom: "from-red-50",
    gradientTo: "to-red-100/40",
    icon: AlertCircle,
    dot: "bg-red-500",
  },
};

function getPlanConfig(status?: string) {
  const key = (status ?? "free").toLowerCase() as PlanKey;
  return planConfig[key] ?? planConfig.free;
}

export function AccountInfoCard({
  email,
  subscriptionStatus = "free",
  onEmailUpdateClick,
  onUpgradeClick,
}: AccountInfoCardProps) {
  const plan = getPlanConfig(subscriptionStatus);
  const PlanIcon = plan.icon;
  const isActive = subscriptionStatus.toLowerCase() === "active";
  const isExpired = subscriptionStatus.toLowerCase() === "expired";
  const isFree = subscriptionStatus.toLowerCase() === "free";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">

      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-800 tracking-tight">
            Account
          </span>
        </div>

        {/* Live status pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${plan.border} bg-white/80`}>
          <span className={`h-1.5 w-1.5 rounded-full ${plan.dot} ${isActive ? "animate-pulse" : ""}`} />
          <span className={`text-[11px] font-semibold ${plan.color}`}>
            {plan.label}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Email Row */}
        <button
          type="button"
          onClick={onEmailUpdateClick}
          className="group w-full text-left rounded-xl border border-slate-150 bg-slate-50/70 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all duration-200 p-4"
        >
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="relative h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-slate-600" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                Email address
              </p>
              <p
                className="text-sm font-semibold text-slate-800 truncate leading-snug"
                title={email}
              >
                {email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-[11px] text-emerald-600 font-medium">Verified</span>
                <span className="text-[11px] text-slate-300 mx-0.5">·</span>
                <span className="text-[11px] text-slate-400">OTP protected</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="shrink-0 h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 group-hover:shadow-sm transition-all">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>

        {/* Subscription Card */}
        <div className={`rounded-xl border bg-linear-to-br ${plan.gradientFrom} ${plan.gradientTo} ${plan.border} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${plan.bg} border ${plan.border} flex items-center justify-center shrink-0`}>
                <PlanIcon className={`h-4.5 w-4.5 ${plan.color}`} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                  Subscription
                </p>
                <p className={`text-base font-bold leading-snug ${plan.color}`}>
                  {plan.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{plan.sublabel}</p>
              </div>
            </div>

            {isActive && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1">
                  <Zap className="h-3 w-3 text-emerald-600 fill-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-700">Active</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        {isFree && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="group w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 p-px transition-all duration-200 shadow-md shadow-indigo-200/50"
          >
            <div className="rounded-[11px] bg-linear-to-r from-indigo-600 to-violet-600 group-hover:from-indigo-500 group-hover:to-violet-500 px-4 py-3 flex items-center justify-between transition-all">
              <div className="flex items-center gap-2.5">
                <Crown className="h-4 w-4 text-indigo-200 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-tight">
                    Upgrade to Premium
                  </p>
                  <p className="text-[11px] text-indigo-200 mt-0.5">
                    AI matching · Priority support · More posts
                  </p>
                </div>
              </div>
              <div className="h-7 w-7 rounded-lg bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors shrink-0">
                <ArrowUpRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </button>
        )}

        {isExpired && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-700 leading-tight">
                  Subscription expired
                </p>
                <p className="text-[11px] text-red-400 mt-0.5">
                  Renew to restore premium access
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onUpgradeClick}
              className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Renew
            </button>
          </div>
        )}

        {isActive && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 leading-tight">
                All premium features active
              </p>
              <p className="text-[11px] text-emerald-500 mt-0.5">
                AI matching, priority support &amp; unlimited posts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}