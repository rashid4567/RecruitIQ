import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Mail,
  FileText,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Crown,
} from "lucide-react";

interface AccountInfoCardProps {
  email: string;
  jobPostsUsed?: number;
  subscriptionStatus?: string;
  onEmailUpdateClick: () => void;
}

const planConfig: Record<
  string,
  { label: string; color: string; bg: string; ring: string; icon: React.ElementType }
> = {
  free:       { label: "Free",       color: "text-slate-600",  bg: "bg-slate-100",  ring: "ring-slate-200",  icon: Sparkles },
  basic:      { label: "Basic",      color: "text-sky-700",    bg: "bg-sky-100",    ring: "ring-sky-200",    icon: TrendingUp },
  pro:        { label: "Pro",        color: "text-indigo-700", bg: "bg-indigo-100", ring: "ring-indigo-200", icon: Crown },
  enterprise: { label: "Enterprise", color: "text-emerald-700",bg: "bg-emerald-100",ring: "ring-emerald-200",icon: Shield },
};

function getPlanConfig(status?: string) {
  const key = (status ?? "free").toLowerCase();
  return planConfig[key] ?? planConfig["free"];
}

export function AccountInfoCard({
  email,
  jobPostsUsed = 0,
  subscriptionStatus = "free",
  onEmailUpdateClick,
}: AccountInfoCardProps) {
  const plan = getPlanConfig(subscriptionStatus);
  const PlanIcon = plan.icon;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
  
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <span className="text-sm font-semibold text-slate-800">Account Information</span>
      </div>

      <div className="p-5 space-y-4">

        <button
          type="button"
          onClick={onEmailUpdateClick}
          className="group w-full text-left rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-200 p-4"
        >
          <div className="flex items-center gap-3">
          
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
              <Mail className="h-4.5 w-4.5 text-blue-600" />
            </div>

    
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 mb-0.5">Email address</p>
              <p
                className="text-sm font-semibold text-slate-800 truncate"
                title={email}
              >
                {email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-xs text-emerald-600 font-medium">Verified</span>
                <span className="text-xs text-slate-400 mx-1">·</span>
                <span className="text-xs text-slate-400">OTP required to change</span>
              </div>
            </div>

    
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Update
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>


        <div className="grid grid-cols-2 gap-3">
      
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Used
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">
              {jobPostsUsed}
            </p>
            <p className="text-xs text-slate-500 mt-1">Job posts</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-8 w-8 rounded-lg ${plan.bg} flex items-center justify-center`}>
                <PlanIcon className={`h-3.5 w-3.5 ${plan.color}`} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Plan
              </span>
            </div>
            <p className={`text-2xl font-bold leading-none ${plan.color}`}>
              {plan.label}
            </p>
            <p className="text-xs text-slate-500 mt-1">Subscription</p>
          </div>
        </div>

       
        {subscriptionStatus?.toLowerCase() === "free" ? (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Crown className="h-4 w-4 text-indigo-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-indigo-800">Unlock Pro features</p>
                <p className="text-[11px] text-indigo-500 mt-0.5">
                  More job posts, AI matching & priority support
                </p>
              </div>
            </div>
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 shrink-0 cursor-pointer">
              Upgrade
            </Badge>
          </div>
        ) : (
          <div className={`rounded-xl border ${plan.ring} ring-1 ${plan.bg.replace("bg-", "bg-").replace("100", "50/60")} p-3.5 flex items-center gap-2.5`}>
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${plan.color}`} />
            <p className={`text-xs font-semibold ${plan.color}`}>
              {plan.label} plan active — all features unlocked
            </p>
          </div>
        )}
      </div>
    </div>
  );
}