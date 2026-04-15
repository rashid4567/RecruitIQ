import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, CheckCircle, Loader2, AlertCircle, X, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerifyOtp: (email: string, otp: string) => Promise<boolean>;
  verifyingOtp?: boolean;
  onResendOtp?: () => Promise<void>;
}

const RESEND_COUNTDOWN = 30;

export function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onVerifyOtp,
  verifyingOtp = false,
  onResendOtp,
}: EmailVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isProcessing = isSubmitting || verifyingOtp;

  const startCountdown = () => {
    clearInterval(timerRef.current!);
    setCanResend(false);
    setCountdown(RESEND_COUNTDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isOpen) {
      startCountdown();
    } else {
      setOtp("");
      setError("");
      setSuccess(false);
      setIsSubmitting(false);
      setIsResending(false);
      setCanResend(false);
      clearInterval(timerRef.current!);
    }
    return () => clearInterval(timerRef.current!);
  }, [isOpen]);

  const handleSubmit = async () => {
    if (otp.length !== 6 || isProcessing) return;
    setError("");
    setIsSubmitting(true);
    try {
      const isValid = await onVerifyOtp(email, otp);
      if (!isValid) {
        setError("Invalid code. Please check and try again.");
        setOtp("");
        return;
      }
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending || !onResendOtp) return;
    setIsResending(true);
    setError("");
    setOtp("");
    try {
      await onResendOtp();
      startCountdown();
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    onClose();
  };

  const progress = (countdown / RESEND_COUNTDOWN) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        onEscapeKeyDown={(e) => isProcessing && e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center text-center px-8 py-12 bg-white space-y-5"
            >
              {/* Animated success ring */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <CheckCircle className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white"
                >
                  <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2} />
                </motion.div>
              </div>

              <div className="space-y-2">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-slate-900"
                >
                  All verified!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-slate-500 leading-relaxed"
                >
                  Your email address has been<br />successfully confirmed.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full h-1 rounded-full bg-slate-100 overflow-hidden"
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "linear" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white"
            >
              {/* Top decorative section */}
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8 text-white overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                {/* Close button */}
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white">Check your inbox</h2>
                    <p className="text-sm text-white/60 leading-relaxed">
                      We sent a 6-digit code to
                    </p>
                    <p className="text-sm font-semibold text-white truncate">{email}</p>
                  </div>
                </div>
              </div>

              {/* Form section */}
              <div className="px-8 py-7 space-y-6">
                {/* OTP label */}
                <div className="space-y-4">
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

                  {/* OTP slots */}
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      if (error) setError("");
                    }}
                    disabled={isProcessing}
                    containerClassName="justify-between gap-2"
                  >
                    <InputOTPGroup className="gap-2 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className={cn(
                            "flex-1 h-13 text-lg font-bold rounded-2xl border-2 transition-all duration-200",
                            "bg-slate-50 hover:bg-slate-100",
                            error
                              ? "border-red-300 bg-red-50 text-red-600 shake"
                              : otp[i]
                                ? "border-slate-900 bg-white text-slate-900"
                                : "border-slate-200 text-slate-900 focus:border-slate-900 focus:bg-white",
                            "disabled:opacity-40 disabled:cursor-not-allowed"
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Verify button */}
                <Button
                  onClick={handleSubmit}
                  disabled={otp.length !== 6 || isProcessing}
                  className={cn(
                    "w-full h-12 rounded-2xl text-sm font-semibold transition-all duration-200",
                    otp.length === 6 && !isProcessing
                      ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying your code...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Verify email address
                    </span>
                  )}
                </Button>

                {/* Resend section */}
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-slate-400">Didn't get the code?</p>

                  {!onResendOtp ? (
                    <span className="text-sm text-slate-300">Resend unavailable</span>
                  ) : canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors disabled:opacity-50"
                    >
                      {isResending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      {isResending ? "Sending..." : "Resend now"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Circular countdown */}
                      <div className="relative h-5 w-5">
                        <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                          <circle
                            cx="10" cy="10" r="8"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="2"
                          />
                          <circle
                            cx="10" cy="10" r="8"
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 8}`}
                            strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-600 tabular-nums">
                        {countdown}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}