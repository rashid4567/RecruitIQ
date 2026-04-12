import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  requestEmailUpdateUc,
  verifyEmailUpdateUc,
} from "@/module/auth/presentation/di/auth";

export function useEmailUpdateForm(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  // Countdown Timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const resetState = useCallback(() => {
    setNewEmail("");
    setOtp("");
    setOtpSent(false);
    setError("");
    setCountdown(0);
  }, []);

  const openModal = useCallback(() => {
    resetState();
    setIsOpen(true);
  }, [resetState]);

  const closeModal = useCallback(() => {
    if (isSendingOtp || isVerifyingOtp) return;
    resetState();
    setIsOpen(false);
  }, [isSendingOtp, isVerifyingOtp, resetState]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendOtp = async () => {
    const trimmedEmail = newEmail.trim();
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsSendingOtp(true);
      setError("");
      await requestEmailUpdateUc.execute({ email: trimmedEmail });

      setNewEmail(trimmedEmail); // Store clean email
      setOtpSent(true);
      setCountdown(60);

      toast.success("Verification code sent", {
        description: "Please check your inbox",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to send verification code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setError("");
      await verifyEmailUpdateUc.execute({ email: newEmail, otp });

      toast.success("Email updated successfully!");
      onSuccess?.();
      closeModal();
    } catch (err: any) {
      setError(err?.message || "Invalid verification code");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;

    try {
      setIsSendingOtp(true);
      setError("");
      await requestEmailUpdateUc.execute({ email: newEmail });
      setCountdown(60);
      toast.success("New verification code sent");
    } catch (err: any) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    newEmail,
    setNewEmail,
    otp,
    setOtp,
    otpSent,
    isSendingOtp,
    isVerifyingOtp,
    countdown,
    error,
    sendOtp,
    verifyOtp,
    resendOtp,
  };
}