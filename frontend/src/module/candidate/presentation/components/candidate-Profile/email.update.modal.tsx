"use client";

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
      setTimeout(onClose, 1500);
    } catch {
      setError("An error occurred. Please try later.");
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
          "sm:max-w-md p-0 border border-gray-200 rounded-lg shadow-md",
          "bg-white dark:bg-gray-800"
        )}
        onInteractOutside={(e) => !canInteract && e.preventDefault()}
        onEscapeKeyDown={(e) => !canInteract && e.preventDefault()}
      >
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={handleClose}
            disabled={!canInteract}
          >
            <X className="h-4 w-4" />
          </Button>

          <DialogHeader className="flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-blue-100 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Verify Your Email
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              We've sent a 6-digit code to {email}.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h3 className="text-lg font-medium text-green-700 dark:text-green-400">
                  Verified Successfully!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your email has been confirmed.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isProcessing}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-10 w-10 text-center text-lg border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center text-sm text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {error}
                  </motion.div>
                )}

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  No code received?{" "}
                  {onResendOtp ? (
                    <button
                      className="text-blue-600 hover:underline dark:text-blue-400"
                      onClick={onResendOtp}
                      disabled={isProcessing}
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-gray-500">Resend (soon)</span>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={otp.length !== 6 || isProcessing}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
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