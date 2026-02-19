import {
  requestEmailUpdateUc,
  verifyEmailUpdateUc,
} from "@/module/auth/presentation/di/auth";
import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

function extractErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useEmailUpdate() {
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);

  /**
   * Request OTP for email update
   */
  const sendOtp = async (email: string): Promise<boolean> => {
    if (sendingOtp) return false; // prevent duplicate calls

    setSendingOtp(true);

    try {
      await requestEmailUpdateUc.execute({ email });

      toast.success("Verification code sent!", {
        description: `OTP sent to ${email}`,
      });

      return true;
    } catch (error: unknown) {
      toast.error(
        extractErrorMessage(
          error,
          "Failed to send verification code"
        )
      );
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  /**
   * Verify OTP and update email
   */
  const verifyOtp = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    if (verifyingOtp) return false; // prevent duplicate calls

    setVerifyingOtp(true);

    try {
      await verifyEmailUpdateUc.execute({ email, otp });

      toast.success("Email updated successfully 🎉");
      return true;
    } catch (error: unknown) {
      toast.error(
        extractErrorMessage(
          error,
          "Invalid verification code"
        )
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
