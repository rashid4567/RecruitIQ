import {
  Loader2, X, Briefcase, FileText,
  Star, Cpu, ArrowRight, ShieldCheck, Lock,
  Plus, Minus,
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

const CREDITS = [
  { icon: Briefcase, label: "Job posts",         key: "jobPostsPerMonth"     },
  { icon: Star,      label: "Screening credits",  key: "screeningCredits"     },
  { icon: FileText,  label: "Resume parses",      key: "resumeParsesPerMonth" },
  { icon: Cpu,       label: "AI score credits",   key: "aiScoreCredits"       },
] as const;

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">

        {/* ── Header ── */}
        <div className="bg-[#0f172a] px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="mb-[3px] text-[10px] uppercase tracking-[0.1em] font-medium text-slate-500">
                Subscription
              </p>
              <h2 className="text-[16px] font-medium text-slate-100">
                Choose duration
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-white/10 bg-white/[0.06] text-slate-500 transition-colors hover:bg-white/[0.12]"
            >
              <X className="h-[14px] w-[14px]" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-[6px] rounded-full border border-blue-500/30 bg-blue-500/15 px-[10px] py-1">
              <span className="h-[6px] w-[6px] rounded-full bg-blue-500" />
              <span className="text-[12px] font-medium text-blue-300">
                {selectedPlan.name} Plan
              </span>
            </div>
            <div className="flex items-baseline gap-[2px]">
              <span className="text-[17px] font-medium text-slate-200">
                {inr(selectedPlan.price)}
              </span>
              <span className="text-[11px] text-slate-500">/mo</span>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col gap-[14px] p-5">

          {/* Stepper */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-[14px] py-3">
            <div className="flex items-center justify-between gap-3">

              {/* − */}
              <button
                onClick={dec}
                disabled={durationMonths === 1}
                className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-[14px] w-[14px]" />
              </button>

              {/* Counter */}
              <div className="flex-1 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-[28px] font-medium leading-none text-slate-900">
                    {durationMonths}
                  </span>
                  <span className="text-[12px] text-slate-400">
                    {durationMonths === 1 ? "month" : "months"}
                  </span>
                </div>

                {/* Dot indicator */}
                <div className="mt-[7px] flex items-center justify-center gap-[3px]">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                    const isActive = n === durationMonths;
                    const isPast = n < durationMonths;
                    return (
                      <button
                        key={n}
                        onClick={() => setDurationMonths(n)}
                        className="transition-all duration-150"
                        style={{
                          width: isActive ? "14px" : "5px",
                          height: "5px",
                          borderRadius: isActive ? "3px" : "50%",
                          background: isActive
                            ? "#2563eb"
                            : isPast
                            ? "#93c5fd"
                            : "#e2e8f0",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                        }}
                        aria-label={`${n} month${n > 1 ? "s" : ""}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* + */}
              <button
                onClick={inc}
                disabled={durationMonths === 12}
                className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-[14px] w-[14px]" />
              </button>

            </div>
          </div>

          {/* Summary card */}
          <div className="overflow-hidden rounded-xl border border-slate-100">

            {/* Top: price + duration */}
            <div className="flex flex-col gap-[7px] border-b border-slate-100 px-[14px] py-3">
              <Row label="Monthly price" value={inr(selectedPlan.price)} />
              <Row
                label="Duration"
                value={`${durationMonths} month${durationMonths > 1 ? "s" : ""}`}
              />
            </div>

            {/* Credits */}
            <div className="flex flex-col gap-[6px] border-b border-slate-100 bg-slate-50 px-[14px] py-[10px]">
              {CREDITS.map(({ icon: Icon, label, key }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="flex items-center gap-[5px] text-[12px] text-slate-500">
                    <Icon className="h-[13px] w-[13px]" />
                    {label}
                  </span>
                  <span className="text-[12px] font-medium text-slate-800">
                    {fmt(selectedPlan[key] as number, durationMonths)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-[14px] py-[10px]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.07em] font-medium text-slate-400">
                  Total
                </p>
                <p className="text-[11px] text-slate-400">
                  {inr(selectedPlan.price)} × {durationMonths}
                </p>
              </div>
              <p className="text-[22px] font-medium text-slate-900">
                {inr(totalAmount)}
              </p>
            </div>
          </div>

          {/* Pay CTA */}
          <button
            onClick={handleSubscribe}
            disabled={paymentLoading}
            className="flex w-full items-center justify-center gap-[7px] rounded-[9px] bg-blue-600 py-[11px] text-[13px] font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 active:scale-[0.99]"
          >
            {paymentLoading ? (
              <>
                <Loader2 className="h-[13px] w-[13px] animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="h-[13px] w-[13px]" />
                Pay {inr(totalAmount)}
                <ArrowRight className="h-[13px] w-[13px]" />
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-[3px] text-center text-[10px] text-slate-400">
            <ShieldCheck className="h-[11px] w-[11px]" />
            Secured payment · Cancel anytime
          </p>

        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-slate-500">{label}</span>
      <span className="text-[12px] font-medium text-slate-800">{value}</span>
    </div>
  );
}