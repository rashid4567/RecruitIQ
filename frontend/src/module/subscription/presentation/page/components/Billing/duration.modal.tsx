import {
  Loader2,
  X,
  Briefcase,
  Star,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Lock,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import type { SubscriptionPlan } from "@/module/subscription/domain/entity/SubscriptionPlan.entity";

interface SubscriptionDurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlan;
  durationMonths: number;
  setDurationMonths: (months: number) => void;
  totalAmount: number;
  paymentLoading: boolean;
  handleSubscribe: () => void;
}

const fmt = (value: number, multiplier: number) =>
  value === -1 ? "Unlimited" : (value * multiplier).toLocaleString("en-IN");

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface CreditRow {
  icon: React.ElementType;
  label: string;
  getValue: (plan: SubscriptionPlan) => number;
  color: string;
  bg: string;
}

const CREDITS: CreditRow[] = [
  {
    icon: Briefcase,
    label: "Job posts",
    getValue: (p) => p.jobPostsPerMonth,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Star,
    label: "Screening credits",
    getValue: (p) => p.screeningCredits,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Cpu,
    label: "AI score credits",
    getValue: (p) => p.aiScoreCredits,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

const DURATION_PRESETS = [1, 3, 6, 12];

export default function SubscriptionDurationModal({
  isOpen,
  onClose,
  selectedPlan,
  durationMonths,
  setDurationMonths,
  totalAmount,
  paymentLoading,
  handleSubscribe,
}: SubscriptionDurationModalProps) {
  if (!isOpen || !selectedPlan) return null;

  const dec = () => setDurationMonths(Math.max(1, durationMonths - 1));
  const inc = () => setDurationMonths(Math.min(12, durationMonths + 1));

  const savings =
    durationMonths >= 12
      ? 20
      : durationMonths >= 6
        ? 10
        : durationMonths >= 3
          ? 5
          : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-105 overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        <div className="relative bg-[#0f172a] px-5 pt-5 pb-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,#fff 0px,#fff 1px,transparent 1px,transparent 28px)",
            }}
          />

          <div className="relative flex items-start justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 mb-2">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span className="text-[11px] font-semibold tracking-wide text-blue-300 uppercase">
                  {selectedPlan.name} Plan
                </span>
              </div>
              <h2 className="text-[18px] font-semibold text-white leading-tight">
                Choose your duration
              </h2>
              <p className="text-[12px] text-slate-400 mt-0.5">
                Longer plans unlock bigger savings
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-slate-400 transition-colors hover:bg-white/15 hover:text-white mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex items-end justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">
                Monthly rate
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[26px] font-bold text-white leading-none">
                  {inr(selectedPlan.price)}
                </span>
                <span className="text-[12px] text-slate-400">/mo</span>
              </div>
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
                <span className="text-[11px] font-semibold text-emerald-400">
                  Save {savings}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Quick select
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_PRESETS.map((n) => {
                const isActive = durationMonths === n;
                const label = n === 12 ? "1 yr" : `${n} mo`;
                return (
                  <button
                    key={n}
                    onClick={() => setDurationMonths(n)}
                    className={`relative py-2 rounded-xl text-[12px] font-semibold border transition-all ${
                      isActive
                        ? "bg-[#0f172a] text-white border-[#0f172a] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                    {n === 12 && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                        BEST
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-3">
              Fine-tune
            </p>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={dec}
                disabled={durationMonths === 1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <div className="flex-1 text-center">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-[32px] font-bold leading-none text-slate-900 tabular-nums">
                    {durationMonths}
                  </span>
                  <span className="text-[13px] text-slate-400 font-medium">
                    {durationMonths === 1 ? "month" : "months"}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-center gap-0.75">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                    const isActive = n === durationMonths;
                    const isPast = n < durationMonths;
                    return (
                      <button
                        key={n}
                        onClick={() => setDurationMonths(n)}
                        aria-label={`${n} month${n > 1 ? "s" : ""}`}
                        className="transition-all duration-150"
                        style={{
                          width: isActive ? "16px" : "5px",
                          height: "5px",
                          borderRadius: isActive ? "3px" : "50%",
                          background: isActive
                            ? "#0f172a"
                            : isPast
                              ? "#94a3b8"
                              : "#e2e8f0",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                onClick={inc}
                disabled={durationMonths === 12}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f172a] text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
              {CREDITS.map(({ icon: Icon, label, getValue, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3 px-2"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800 tabular-nums">
                    {fmt(getValue(selectedPlan), durationMonths)}
                  </span>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-slate-400">
                  {inr(selectedPlan.price)} × {durationMonths} month
                  {durationMonths > 1 ? "s" : ""}
                </span>
                {savings > 0 && (
                  <span className="text-[11px] font-medium text-emerald-600">
                    {savings}% discount applied
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">
                  Total
                </p>
                <p className="text-[24px] font-bold text-slate-900 leading-none">
                  {inr(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={paymentLoading}
            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] py-3.5 text-[14px] font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-60 active:scale-[0.99] shadow-lg shadow-slate-900/20"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Pay {inr(totalAmount)}
                <ArrowRight className="h-4 w-4 ml-auto absolute right-4" />
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Secured by Razorpay · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
