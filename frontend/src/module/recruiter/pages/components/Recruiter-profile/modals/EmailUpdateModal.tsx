import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        onEscapeKeyDown={(e) => isProcessing && e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white"
            >
              {/* Dark header */}
              <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">
                      Update email
                    </h2>
                    <p className="text-sm text-white/55 leading-relaxed">
                      Enter your new email address and we'll send a verification
                      code
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
                          !isProcessing
                        ) {
                          onSendOtp();
                        }
                      }}
                      autoFocus
                      className={cn(
                        "pl-10 h-12 rounded-2xl border-2 text-sm transition-all",
                        error
                          ? "border-red-300 bg-red-50 focus-visible:ring-0 focus-visible:border-red-400"
                          : "border-slate-200 bg-slate-50 focus-visible:ring-0 focus-visible:border-slate-900 focus-visible:bg-white",
                      )}
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                          <p className="text-sm text-red-600">{error}</p>
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
                    onClick={onSendOtp}
                    disabled={isProcessing || !newEmail.trim()}
                    className="flex-1 h-11 rounded-2xl text-sm font-semibold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isSendingOtp ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send code
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white"
            >
              <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">
                      Enter the code
                    </h2>
                    <p className="text-sm text-white/55">
                      We sent a 6-digit code to
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {newEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-7 space-y-6">
                <div className="space-y-3">
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
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Verify button */}
                <Button
                  onClick={onVerifyOtp}
                  disabled={otp.length !== 6 || isProcessing}
                  className="w-full h-12 rounded-2xl text-sm font-semibold transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isVerifyingOtp ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
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
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change email
                  </button>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-400">No code?</p>
                    {countdown === 0 ? (
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
                        Resend
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
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
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
