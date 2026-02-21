import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { UserRole } from "@/module/auth/domain/constants/user-role";
import { resendOtpUc, verifyOtpUc } from "../di/auth";

const OTP_EXPIRY_SECONDS = 120;

export type VerifyOTPState = {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
};

export function useVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- STATE ----------------

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [state, setState] = useState<VerifyOTPState | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------------- INIT ----------------

  useEffect(() => {
    const s = location.state as VerifyOTPState | undefined;

    if (!s) {
      navigate("/role-selection", { replace: true });
      return;
    }

    setState(s);

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);

    return () => clearTimeout(focusTimer);
  }, [location, navigate]);

  // ---------------- TIMER ----------------

  useEffect(() => {
    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  // ---------------- INPUT HELPERS ----------------

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

  // ---------------- VERIFY ----------------

  const verifyOtp = async () => {
    if (!state) return;

    const otpStr = otp.join("");

    if (otpStr.length !== 6) {
      setError("Please enter the full 6-digit code");
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

      if (timerRef.current) clearInterval(timerRef.current);

      setTimeout(() => {
        navigate(
          state.role === "candidate"
            ? "/candidate/profile/complete"
            : "/recruiter/complete-profile",
        );
      }, 1800);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------------- RESEND ----------------

  const resendOtp = async () => {
    if (!state || timeLeft > 0) return;

    setIsResending(true);
    setError(null);

    try {
      await resendOtpUc.execute(state.email, state.role);

      setOtp(Array(6).fill(""));
      setTimeLeft(OTP_EXPIRY_SECONDS);
      inputRefs.current[0]?.focus();

      setError("New OTP sent! Check your inbox.");
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  // ---------------- HELPERS ----------------

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / OTP_EXPIRY_SECONDS) * 100;

  const maskedEmail =
    state?.email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length)) ?? "";

  return {
    otp,
    setOtp,
    timeLeft,
    progress,
    error,
    success,
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
