import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
  onSendOtp: (email: string) => Promise<void>;
  onVerifyOtp: (otp: string) => Promise<void>;
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
}

export function EmailUpdateModal({
  isOpen,
  onClose,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  newEmail,
  setNewEmail,
  otp,
  setOtp,
  otpSent,
  isSendingOtp,
  isVerifyingOtp,
  countdown,
  error,
}: EmailUpdateModalProps) {
  const isProcessing = isSendingOtp || isVerifyingOtp;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        onEscapeKeyDown={(e) => isProcessing && e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {!otpSent ? (
            /* ==================== EMAIL STEP ==================== */
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="bg-white"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">Update email</h2>
                    <p className="text-sm text-white/60">
                      Enter your new email address and we'll send a verification code
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-7 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    New email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      disabled={isProcessing}
                      onKeyDown={(e) => e.key === "Enter" && onSendOtp(newEmail)}
                      autoFocus
                      className={cn(
                        "pl-10 h-12 rounded-2xl border-2 text-sm transition-all",
                        error
                          ? "border-red-300 bg-red-50 focus:border-red-400"
                          : "border-slate-200 bg-slate-50 focus:border-slate-900 focus:bg-white"
                      )}
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Info Box */}
                <div className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <ShieldCheck className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">Secure verification</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your email won't change until you enter the 6-digit code. Codes expire in 15 minutes.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1 h-11 rounded-2xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => onSendOtp(newEmail)}
                    disabled={isProcessing || !newEmail}
                    className={cn(
                      "flex-1 h-11 rounded-2xl text-sm font-semibold transition-all",
                      newEmail && !isProcessing
                        ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
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
            /* ==================== OTP STEP ==================== */
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22 }}
              className="bg-white"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8 overflow-hidden">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="absolute right-4 top-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">Enter the code</h2>
                    <p className="text-sm text-white/55">We sent a 6-digit code to</p>
                    <p className="text-sm font-semibold text-white truncate">{newEmail}</p>
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
                      <p className="text-xs text-slate-400">{otp.length}/6</p>
                    )}
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isProcessing}
                    containerClassName="justify-between gap-2"
                  >
                    <InputOTPGroup className="gap-2 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className={cn(
                            "flex-1 h-13 text-lg font-bold rounded-2xl border-2 bg-slate-50 transition-all",
                            error
                              ? "border-red-300 bg-red-50 text-red-600"
                              : otp[i]
                              ? "border-slate-900 bg-white text-slate-900"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white"
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
                        className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  onClick={() => onVerifyOtp(otp)}
                  disabled={otp.length !== 6 || isProcessing}
                  className={cn(
                    "w-full h-12 rounded-2xl text-sm font-semibold transition-all",
                    otp.length === 6 && !isProcessing
                      ? "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isVerifyingOtp ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Verify & update email
                    </span>
                  )}
                </Button>

                {/* Resend Section */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 disabled:opacity-50"
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
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-700 disabled:opacity-50"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Resend
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                        {countdown}s
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