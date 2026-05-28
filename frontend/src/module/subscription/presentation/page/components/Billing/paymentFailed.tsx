import { useEffect, useState } from "react";

interface SubscriptionFailedProps {
  errorCode?: string;
  onRetryClick?: () => void;
  onBackClick?: () => void;
  onSupportClick?: () => void;
}

export default function SubscriptionFailed({
  errorCode = "ERR_PAYMENT_DECLINED",
  onRetryClick = () => {},
  onBackClick = () => {},
  onSupportClick = () => {},
}: SubscriptionFailedProps) {
  const [mounted, setMounted] = useState(false);
  const [refId] = useState(
    () => "PYM-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const reasons = [
    "Insufficient funds or credit limit reached",
    "Billing address mismatch with card records",
    "Card expired or temporarily blocked by issuer",
    "Gateway connection timeout during processing",
  ];

  const steps = [
    {
      num: "01",
      title: "Verify your card",
      desc: "Check number, expiry date, and CVV are correct",
    },
    {
      num: "02",
      title: "Check billing address",
      desc: "Must match exactly what's on file at your bank",
    },
    {
      num: "03",
      title: "Try another method",
      desc: "Use an alternate card or contact your bank",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fdf8f8] via-[#fdf5f5] to-[#fff9f9] font-serif">
      <div className="pointer-events-none absolute -right-[6%] -top-[8%] h-125 w-125 rounded-full bg-[radial-linear(circle,rgba(180,40,55,0.13)_0%,transparent_70%)] blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-[5%] -left-[8%] h-115 w-115 rounded-full bg-[radial-linear(circle,rgba(155,30,45,0.09)_0%,transparent_70%)] blur-[70px]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-linear(rgba(180,40,55,0.04)_1px,transparent_1px),linear-linear(90deg,rgba(180,40,55,0.04)_1px,transparent_1px)] bg-size-[64px_64px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-180">
          <div
            className={`mb-7 text-center transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,40,55,0.32)] bg-[rgba(180,40,55,0.08)] px-4.5 py-1.25 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#9B2335]">
              <span className="inline-block h-1.5 w-1.5 animate-[blink_2s_infinite] rounded-full bg-[#C83040] shadow-[0_0_6px_rgba(180,40,55,0.6)]" />
              Transaction Declined
            </span>
          </div>

          <div
            className={`overflow-hidden rounded-4xl border border-[rgba(180,40,55,0.16)] bg-white shadow-[0_4px_6px_rgba(180,40,55,0.04),0_20px_60px_rgba(180,40,55,0.07)] transition-all duration-800 [cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-6 scale-[0.98] opacity-0"
            }`}
          >
            <div className="relative border-b border-[rgba(180,40,55,0.1)] bg-linear-to-br from-[#fff8f8] via-[#fdf0f0] to-[#fef5f5] px-10 pb-8 pt-10 text-center">
              <div className="absolute left-1/2 top-0 h-0.75 w-25 -translate-x-1/2 rounded-b bg-linear-to-r from-transparent via-[#B42837] to-transparent" />
              <div className="relative mb-5 inline-flex items-center justify-center">
                <div className="absolute h-22 w-22 rounded-full border border-[rgba(180,40,55,0.2)]" />
                <div className="absolute h-27.5 w-27.5 rounded-full border border-[rgba(180,40,55,0.09)]" />
                <div
                  className={`flex h-17 w-17 items-center justify-center rounded-full bg-linear-to-br from-[#9B2335] via-[#C83040] to-[#D4404F] shadow-[0_4px_20px_rgba(180,40,55,0.35),0_2px_8px_rgba(0,0,0,0.07)] transition-all delay-100 duration-900 [cubic-bezier(0.34,1.56,0.64,1)] ${
                    mounted ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path
                      d="M7 7L19 19M19 7L7 19"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="mb-2 text-[clamp(1.5rem,4vw,2.1rem)] font-normal leading-tight tracking-[-0.02em] text-[#8B1A28]">
                Payment Could Not Be Processed
              </h1>
              <p className="font-sans text-[0.9rem] leading-relaxed text-[#9a4a52]">
                This is typically temporary and straightforward to resolve.
              </p>
            </div>

            <div className="px-10 pb-9 pt-7">
              <div className="mb-6 flex items-start gap-3 rounded-[13px] border border-[rgba(180,40,55,0.18)] bg-[rgba(180,40,55,0.05)] p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(180,40,55,0.12)]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B42837"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <div className="mb-1 font-sans text-xs font-bold text-[#8B1A28]">
                    What went wrong?
                  </div>
                  <div className="mb-1.5 font-sans text-[11px] leading-relaxed text-[#9a5058]">
                    Your bank or payment provider declined the authorization.
                    This is often due to security flags or account limits — not
                    an issue on our end.
                  </div>
                  <div className="font-mono text-[10px] font-semibold text-[#B42837]">
                    Error: {errorCode} · Ref: {refId}
                  </div>
                </div>
              </div>

              <p className="mb-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#B42837]">
                Common causes
              </p>
              <div className="mb-6 flex flex-col gap-1.5">
                {reasons.map((r, i) => (
                  <div
                    key={i}
                    className="flex cursor-default items-center gap-2.5 rounded-lg border border-[rgba(180,40,55,0.1)] bg-[rgba(180,40,55,0.03)] px-3.5 py-2 transition-all duration-200 hover:border-[rgba(180,40,55,0.28)] hover:bg-[rgba(180,40,55,0.07)]"
                  >
                    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C83040]" />
                    <span className="font-sans text-xs text-[#6a3035]">
                      {r}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mb-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#B42837]">
                Resolution steps
              </p>
              <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className="cursor-default rounded-xl border border-black/[0.07] bg-[#fafafa] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(180,40,55,0.3)] hover:bg-[rgba(180,40,55,0.04)] hover:shadow-[0_4px_16px_rgba(180,40,55,0.1)]"
                  >
                    <div className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.15em] text-[#B42837]">
                      {s.num}
                    </div>
                    <div className="mb-1 font-sans text-xs font-bold text-[#2a1a1c]">
                      {s.title}
                    </div>
                    <div className="font-sans text-[11px] leading-relaxed text-[#888]">
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={onRetryClick}
                  className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-[11px] bg-linear-to-br from-[#9B2335] via-[#C83040] to-[#D4404F] px-5 py-3.5 font-sans text-[13px] font-bold tracking-[0.04em] text-white shadow-[0_4px_16px_rgba(180,40,55,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(180,40,55,0.4)]"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  </svg>
                  Retry Payment
                </button>

                <button
                  onClick={onBackClick}
                  className="flex min-w-37.5 flex-1 items-center justify-center gap-2 rounded-[11px] border-[1.5px] border-[rgba(180,40,55,0.3)] bg-transparent px-5 py-3.5 font-sans text-[13px] font-bold tracking-[0.04em] text-[#9B2335] transition-all duration-200 hover:border-[rgba(180,40,55,0.55)] hover:bg-[rgba(180,40,55,0.06)]"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Pricing
                </button>

                <button
                  onClick={onSupportClick}
                  className="min-w-35 flex-1 rounded-[11px] border border-black/8 bg-[#f4f4f4] px-5 py-3.5 font-sans text-[13px] font-semibold tracking-[0.04em] text-[#666] transition-all duration-200 hover:bg-[#ebebeb] hover:text-[#333]"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center font-sans text-[11px] text-[#aaa]">
            No charge was made to your account · Reference: {refId}
          </p>
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>
    </div>
  );
}
