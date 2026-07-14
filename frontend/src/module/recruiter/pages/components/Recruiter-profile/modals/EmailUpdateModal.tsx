import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Mail,
  Lock,
  Send,
  Loader2,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOtp: () => Promise<void>;
  onVerifyOtp: () => Promise<void>;
  onResendOtp: () => Promise<void>;
  newEmail: string;
  setNewEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  otpSent: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  countdown: number;
  error: string;
  setError: (error: string) => void;
}

type Step = "email" | "otp" | "success";

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "otp", label: "Verify" },
  { key: "success", label: "Done" },
];

function StepProgress({ step }: { step: Step }) {
  const order: Step[] = ["email", "otp", "success"];
  const activeIndex = order.indexOf(step);

  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((s, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors shrink-0",
                  isDone
                    ? "bg-white text-slate-900"
                    : isActive
                      ? "bg-white/20 text-white ring-2 ring-white/40"
                      : "bg-white/10 text-white/40",
                )}
              >
                {isDone ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium hidden sm:inline",
                  isActive || isDone ? "text-white/80" : "text-white/30",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <span
                className={cn(
                  "w-5 h-px",
                  isDone ? "bg-white/60" : "bg-white/15",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function isValidEmailFormat(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function EmailUpdateModal({
  isOpen,
  onClose,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  newEmail = "",
  setNewEmail,
  otp = "",
  setOtp,
  otpSent,
  isSendingOtp,
  isVerifyingOtp,
  countdown,
  error = "",
  setError,
}: EmailUpdateModalProps) {
  const isProcessing = isSendingOtp || isVerifyingOtp;
  const circumference = 2 * Math.PI * 10;
  const progress = countdown > 0 ? (countdown / 60) * circumference : 0;

  const [step, setStep] = useState<Step>("email");
  const [justSent, setJustSent] = useState(false);
  const [autoVerifyLock, setAutoVerifyLock] = useState(false);
  const shakeControls = useAnimation();
  const wasVerifyingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset local state whenever the modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep("email");
      setJustSent(false);
      setAutoVerifyLock(false);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }
  }, [isOpen]);

  // Move to OTP step once code has been sent; show a brief "sent" confirmation first
  useEffect(() => {
    if (otpSent && step === "email") {
      setJustSent(true);
      const t = setTimeout(() => {
        setJustSent(false);
        setStep("otp");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [otpSent, step]);

  // Detect verify completion: isVerifyingOtp went true -> false with no error means success
  useEffect(() => {
    if (wasVerifyingRef.current && !isVerifyingOtp) {
      if (!error && step === "otp") {
        setStep("success");
        closeTimerRef.current = setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setAutoVerifyLock(false);
      }
    }
    wasVerifyingRef.current = isVerifyingOtp;
  }, [isVerifyingOtp, error, step, onClose]);

  // Shake animation whenever an error appears on the OTP step
  useEffect(() => {
    if (error && step === "otp") {
      shakeControls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45 },
      });
    }
  }, [error, step, shakeControls]);

  // Auto-verify once all 6 digits are entered
  useEffect(() => {
    if (
      step === "otp" &&
      otp.length === 6 &&
      !isProcessing &&
      !autoVerifyLock
    ) {
      setAutoVerifyLock(true);
      onVerifyOtp();
    }
    if (otp.length < 6) {
      setAutoVerifyLock(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  const emailError =
    error && step === "email"
      ? error
      : newEmail.trim() && !isValidEmailFormat(newEmail)
        ? "That doesn't look like a valid email address."
        : "";

  const handleSendOtp = () => {
    if (!newEmail.trim() || !isValidEmailFormat(newEmail)) {
      setError("That doesn't look like a valid email address.");
      return;
    }
    onSendOtp();
  };

  const handleBackToEmail = () => {
    setOtp("");
    setError("");
    setStep("email");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        onEscapeKeyDown={(e) => isProcessing && e.preventDefault()}
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white"
            >
              {/* Dark header */}
              <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-8 pt-8 pb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative mb-5">
                  <StepProgress step={step} />
                </div>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">
                      Update account email
                    </h2>
                    <p className="text-sm text-white/55 leading-relaxed">
                      Verify ownership before changing your account email
                      address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-7 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    New email address
                  </label>

                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-700 transition-colors pointer-events-none" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isProcessing}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          newEmail.trim() &&
                          isValidEmailFormat(newEmail) &&
                          !isProcessing
                        ) {
                          handleSendOtp();
                        }
                      }}
                      autoFocus
                      className={cn(
                        "pl-10 h-12 rounded-2xl border-2 text-sm transition-all",
                        emailError
                          ? "border-red-300 bg-red-50 focus-visible:ring-0 focus-visible:border-red-400"
                          : "border-slate-200 bg-slate-50 focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:bg-white",
                      )}
                    />
                  </div>

                  <AnimatePresence>
                    {emailError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl"
                          role="alert"
                        >
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-600">
                              {emailError}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <ShieldCheck
                    className="h-5 w-5 text-slate-400 shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-700">
                      Secure verification
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your email won't change until you verify the 6-digit code.
                      Codes expire in 15 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1 h-11 rounded-2xl border-2 border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendOtp}
                    disabled={
                      isProcessing ||
                      !newEmail.trim() ||
                      !isValidEmailFormat(newEmail)
                    }
                    className="flex-1 h-11 rounded-2xl text-sm font-semibold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isSendingOtp ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : justSent ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Code sent
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Continue
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white"
            >
              <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-8 pt-8 pb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative mb-5">
                  <StepProgress step={step} />
                </div>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-white">
                      Enter the code
                    </h2>
                    <p className="text-sm text-white/55">
                      Verification code sent
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-white truncate">
                      📧 {newEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-7 space-y-6">
                <motion.div className="space-y-3" animate={shakeControls}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Verification code
                    </p>
                    {otp.length > 0 && otp.length < 6 && (
                      <p className="text-xs text-slate-400 tabular-nums">
                        {otp.length}/6
                      </p>
                    )}
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      if (error) setError("");
                    }}
                    disabled={isProcessing}
                    autoFocus
                    containerClassName="justify-between gap-2"
                  >
                    <InputOTPGroup className="gap-2 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className={cn(
                            "flex-1 h-13 text-lg font-bold rounded-2xl border-2 bg-slate-50 transition-all duration-150",
                            error
                              ? "border-red-300 bg-red-50 text-red-600"
                              : otp[i]
                                ? "border-slate-900 bg-white text-slate-900"
                                : "border-slate-200 text-slate-900 focus:border-slate-900 focus:bg-white",
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl"
                          role="alert"
                          aria-live="assertive"
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-600">
                                Invalid verification code
                              </p>
                              <p className="text-xs text-red-500 mt-0.5">
                                Please check the 6-digit code or request a new
                                one.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Verify button (fallback — auto-verify handles the common path) */}
                <Button
                  onClick={() => {
                    setAutoVerifyLock(true);
                    onVerifyOtp();
                  }}
                  disabled={otp.length !== 6 || isProcessing}
                  className="w-full h-12 rounded-2xl text-sm font-semibold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isVerifyingOtp ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking your code...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Verify & update email
                    </span>
                  )}
                </Button>

                {/* Resend + change email row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={handleBackToEmail}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Use another email
                  </button>

                  <div className="flex items-center gap-2">
                    {countdown === 0 ? (
                      <>
                        <p className="text-sm text-slate-400">
                          Didn't receive it?
                        </p>
                        <button
                          onClick={onResendOtp}
                          disabled={isSendingOtp}
                          className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                          {isSendingOtp ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5" />
                          )}
                          Resend code
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-slate-400">Resend in</p>
                        <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="2.5"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth="2.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - progress}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-slate-600 tabular-nums">
                          {countdown}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white"
            >
              <div className="relative bg-linear-to-br from-green-500 to-emerald-600 px-8 pt-10 pb-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

                <div className="relative mb-6 flex justify-center">
                  <StepProgress step={step} />
                </div>

                <div className="relative flex flex-col items-center text-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: 0.05,
                    }}
                    className="h-16 w-16 rounded-full bg-white/15 border border-white/30 flex items-center justify-center"
                  >
                    <CheckCircle2
                      className="h-9 w-9 text-white"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white">
                      Email updated successfully
                    </h2>
                    <p className="text-sm text-white/80 leading-relaxed max-w-[240px]">
                      Your account is now using{" "}
                      <span className="font-semibold text-white">
                        {newEmail}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Refreshing profile, closing automatically...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}