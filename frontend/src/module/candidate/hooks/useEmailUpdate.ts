import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import {
  requestEmailUpdate,
  verifyEmailUpdate,
} from "@/module/auth/api/auth.api";

function extractErrorMessage(
  error: unknown,
  fallback: string,
): string {
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

export function useEmailUpdate() {
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const sendOtp = async (
    email: string,
  ): Promise<boolean> => {
    if (sendingOtp) return false;

    setSendingOtp(true);

    try {
      await requestEmailUpdate({
        newEmail: email,
      });

      toast.success("Verification code sent!", {
        description: `OTP sent to ${email}`,
      });

      return true;
    } catch (error) {
      toast.error(
        extractErrorMessage(
          error,
          "Failed to send verification code",
        ),
      );

      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string,
  ): Promise<boolean> => {
    if (verifyingOtp) return false;

    setVerifyingOtp(true);

    try {
      await verifyEmailUpdate({
        newEmail: email,
        otp,
        role : "candidate",
      });

      toast.success("Email updated successfully 🎉");

      return true;
    } catch (error) {
      toast.error(
        extractErrorMessage(
          error,
          "Invalid verification code",
        ),
      );

      return false;
    } finally {
      setVerifyingOtp(false);
    }
  };

  return {
    sendOtp,
    verifyOtp,
    sendingOtp,
    verifyingOtp,
  };
}