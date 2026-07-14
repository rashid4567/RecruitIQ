import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import {
  requestEmailUpdate,
  verifyEmailUpdate,
} from "@/module/auth/api/auth.api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
    }>;
    return axiosError.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useRecruiterEmailUpdate(onSuccess?: () => void) {
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const reset = useCallback(() => {
    setNewEmail("");
    setOtp("");
    setOtpSent(false);
    setCountdown(0);
    setError("");
  }, []);

  const sendOtp = useCallback(async (): Promise<void> => {
    const email = newEmail.trim();
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setSendingOtp(true);
      setError("");
      await requestEmailUpdate({
        newEmail: email,
      });
      setOtpSent(true);
      setCountdown(60);
      toast.success("Verification code sent.", {
        description: "Please check your inbox.",
      });
    } catch (error) {
      setError(getErrorMessage(error, "Failed to send verification code."));
    } finally {
      setSendingOtp(false);
    }
  }, [newEmail]);

const verifyOtp = useCallback(async (): Promise<boolean> => {
  if (!otp.trim()) {
    setError("Please enter the OTP.");
    return false;
  }

  try {
    setVerifyingOtp(true);
    setError("");

    await verifyEmailUpdate({
      newEmail,
      otp,
      role: "recruiter",
    });

    await onSuccess?.();

    toast.success("Email updated successfully.");

    reset();

    return true;
  } catch (error) {
    setError(getErrorMessage(error, "Invalid verification code."));
    return false;
  } finally {
    setVerifyingOtp(false);
  }
}, [newEmail, otp, reset, onSuccess]);
  const resendOtp = useCallback(async (): Promise<void> => {
    if (countdown > 0) return;

    try {
      setSendingOtp(true);
      setError("");
      await requestEmailUpdate({
        newEmail,
      })
      setCountdown(60);
      toast.success("Verification code resent.");
    } catch (error) {
      setError(getErrorMessage(error, "Failed to resend verification code."));
    } finally {
      setSendingOtp(false);
    }
  }, [newEmail, countdown]);

  return {
    newEmail,
    setNewEmail,
    otp,
    setOtp,
    otpSent,
    countdown,
    error,
    setError,
    isSendingOtp: sendingOtp,
    isVerifyingOtp: verifyingOtp,
    sendOtp,
    verifyOtp,
    resendOtp,
    reset,
  };
}
