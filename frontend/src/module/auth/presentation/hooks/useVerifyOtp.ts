import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { UserRole } from "@/module/auth/domain/constants/user-role";
import { sentOtpUc, verifyOtpUc } from "../di/auth";

const OTP_EXPIRY_SECONDS = 120;
const STORAGE_KEY = "otp_timer_state";

export type VerifyOTPState = {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
};

type AxiosLikeError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
};

type StoredTimerState = {
  startedAt: number;
  email: string;
};


function extractAxiosError(
  err: unknown,
): {
  status: number | undefined;
  message: string;
} {
  if (!err) {
    return {
      status: undefined,
      message: "",
    };
  }

  const axiosResponse = (
    err as AxiosLikeError
  ).response;

  if (axiosResponse) {
    const status: number =
      axiosResponse.status ?? 0;

    const serverMessage: string =
      axiosResponse.data?.message ??
      axiosResponse.data?.error ??
      "";

    return {
      status,
      message:
        serverMessage.toLowerCase(),
    };
  }

  const axiosMessage =
    (err as AxiosLikeError)
      .message
      ?.toLowerCase?.() ?? "";

  return {
    status: undefined,
    message: axiosMessage,
  };
}

function classifyError(err: unknown): string {
  if (!err) return "Something went wrong. Please try again.";

  const { status, message } = extractAxiosError(err);

  if (!status) {
    if (message.includes("timeout") || message.includes("timed out")) {
      return "The request timed out. Please check your connection and try again.";
    }
    return "No internet connection. Please check your network and try again.";
  }


  if (
    message.includes("invalid otp") ||
    message.includes("incorrect otp") ||
    message.includes("wrong otp") ||
    message.includes("invalid_otp")
  ) {
    return "That code is incorrect. Please check your email and try again.";
  }

  if (
    message.includes("otp expired") ||
    message.includes("otp_expired") ||
    message.includes("code expired")
  ) {
    return "This code has expired. Please request a new one below.";
  }

  if (message.includes("otp_already_used") || message.includes("already verified")) {
    return "This code has already been used. Please request a new one.";
  }

  if (message.includes("otp_not_found") || message.includes("no otp found")) {
    return "No verification code found. Please request a new one below.";
  }

  if (message.includes("user_already_exists") || message.includes("already exists")) {
    return "An account with this email already exists. Try logging in instead.";
  }

  if (message.includes("email_already_exists")) {
    return "This email is already registered. Try logging in instead.";
  }

  if (message.includes("invalid_email") || (message.includes("email") && message.includes("invalid"))) {
    return "The email address is invalid. Please go back and correct it.";
  }

  if (message.includes("invalid_password") || (message.includes("password") && message.includes("invalid"))) {
    return "The password is invalid. Please go back and try again.";
  }

  if (message.includes("max") && message.includes("attempt")) {
    return "You've exceeded the maximum number of attempts. Please request a new code.";
  }


  if (status === 400) {
    return "The code you entered is invalid. Please double-check and try again.";
  }

  if (status === 401) {
    return "Your session has expired. Please go back and sign up again.";
  }

  if (status === 403) {
    return "You don't have permission to do this. Please contact support.";
  }

  if (status === 404) {
    return "We couldn't find your account. Please go back and try signing up again.";
  }

  if (status === 409) {
    return "An account with this email already exists. Try logging in instead.";
  }

  if (status === 410) {
    return "This code has expired. Please request a new one below.";
  }

  if (status === 422) {
    return "The code format is invalid. Please enter the 6-digit code from your email.";
  }

  if (status === 429) {
    return "Too many attempts. Please wait a few minutes before trying again.";
  }

  if (status === 500) {
    return "Our servers are having trouble right now. Please try again in a moment.";
  }

  if (status === 502 || status === 503) {
    return "Service is temporarily unavailable. Please try again shortly.";
  }

  if (status === 504) {
    return "The server took too long to respond. Please try again.";
  }

  return "Something went wrong. Please try again or contact support if the issue persists.";
}



function getStoredTimeLeft(email: string): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return OTP_EXPIRY_SECONDS;

    const stored: StoredTimerState = JSON.parse(raw);
    if (stored.email !== email) return OTP_EXPIRY_SECONDS;

    const elapsed = Math.floor((Date.now() - stored.startedAt) / 1000);
    return Math.max(0, OTP_EXPIRY_SECONDS - elapsed);
  } catch {
    return OTP_EXPIRY_SECONDS;
  }
}

function storeTimerStart(email: string): void {
  try {
    const data: StoredTimerState = { startedAt: Date.now(), email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to store timer state:", error);
  }
}

function clearStoredTimer(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear timer state:", error);
  }
}

export function useVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [state, setState] = useState<VerifyOTPState | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = location.state as VerifyOTPState | undefined;
    if (!s) {
      navigate("/role-selection", { replace: true });
      return;
    }

    setState(s);

    const restored = getStoredTimeLeft(s.email);
    setTimeLeft(restored);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        storeTimerStart(s.email);
      } else {
        const stored: StoredTimerState = JSON.parse(raw);
        if (stored.email !== s.email) storeTimerStart(s.email);
      }
    } catch {
      storeTimerStart(s.email);
    }

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 400);

    return () => clearTimeout(focusTimer);
  }, [location, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (error) setError(null);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, error],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (!pasted) return;

      const newOtp = [...otp];
      pasted.split("").forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);

      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    },
    [otp],
  );

  const verifyOtp = async () => {
    if (!state) return;

    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      await verifyOtpUc.execute({
        rawEmail: state.email,
        otp: otpStr,
        rawPassword: state.password,
        fullName: state.fullName,
        role: state.role,
      });

      setSuccess(true);
      clearStoredTimer();
      if (timerRef.current) clearInterval(timerRef.current);

      setTimeout(() => {
        navigate(
          state.role === "candidate"
            ? "/candidate/profile/complete"
            : "/recruiter/complete-profile",
        );
      }, 2000);
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (!state || timeLeft > 0) return;

    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await sentOtpUc.execute(state.email, state.role);
      setOtp(Array(6).fill(""));
      storeTimerStart(state.email);
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setResendSuccess(true);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(classifyError(err));
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / OTP_EXPIRY_SECONDS) * 100;

  const maskedEmail =
    state?.email.replace(
      /(.{2})(.*)(?=@)/,
      (_, a, b) => a + "*".repeat(b.length),
    ) ?? "";

  return {
    otp,
    setOtp,
    timeLeft,
    progress,
    error,
    success,
    resendSuccess,
    state,
    isVerifying,
    isResending,
    maskedEmail,
    formatTime,
    setInputRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    verifyOtp,
    resendOtp,
  };
}