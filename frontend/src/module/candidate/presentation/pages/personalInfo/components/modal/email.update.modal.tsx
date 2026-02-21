
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, CheckCircle, Loader2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerifyOtp: (email: string, otp: string) => Promise<boolean>;
  verifyingOtp?: boolean;
  onResendOtp?: () => Promise<void>;
}

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

  const isProcessing = isSubmitting || verifyingOtp;
  const canInteract = !isProcessing;

  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setError("");
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (otp.length !== 6 || isProcessing) return;

    setError("");
    setIsSubmitting(true);

    try {
      const isValid = await onVerifyOtp(email, otp);

      if (!isValid) {
        setError("Invalid code. Please try again.");
        setOtp("");
        return;
      }

      setSuccess(true);
      setTimeout(onClose, 1600);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!canInteract) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-md p-0 overflow-hidden border border-red-100 rounded-xl shadow-xl",
          "bg-white dark:bg-gray-950" // keeping dark mode support but focusing on light/white
        )}
        onInteractOutside={(e) => !canInteract && e.preventDefault()}
        onEscapeKeyDown={(e) => !canInteract && e.preventDefault()}
      >
        {/* Header with subtle red accent */}
        <div className="relative px-8 pt-8 pb-6 bg-white border-b border-red-50">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            onClick={handleClose}
            disabled={!canInteract}
          >
            <X className="h-5 w-5" />
          </Button>

          <DialogHeader className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Mail className="h-7 w-7 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Verify your email
            </DialogTitle>
            <DialogDescription className="mt-3 text-base text-gray-600">
              We sent a 6-digit code to
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-8 pb-8 pt-6">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center py-10 space-y-5"
              >
                <div className="rounded-full bg-green-50 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Email Verified!
                </h3>
                <p className="text-gray-600">
                  Thank you — your email is now confirmed.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isProcessing}
                  containerClassName="justify-center gap-3"
                >
                  <InputOTPGroup className="gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={cn(
                          "h-12 w-11 text-center text-xl font-medium rounded-lg border border-gray-200",
                          "focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:ring-offset-2",
                          "transition-all shadow-sm hover:border-gray-300",
                          "disabled:opacity-60 dark:border-gray-700 dark:focus:border-red-400 dark:focus:ring-red-400"
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-red-600"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}

                <div className="text-center text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  {onResendOtp ? (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                      onClick={onResendOtp}
                      disabled={isProcessing}
                    >
                      Resend code
                    </button>
                  ) : (
                    <span className="text-gray-400">Resend (coming soon)</span>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={otp.length !== 6 || isProcessing}
                  className={cn(
                    "w-full h-11 text-base font-medium",
                    "bg-red-600 hover:bg-red-700 text-white",
                    "transition-all duration-200 shadow-md hover:shadow-lg",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}