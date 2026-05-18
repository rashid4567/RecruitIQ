import { useState, useCallback, useRef } from "react";

export type ForgotPasswordStatus = "idle" | "loading" | "success" | "error";

export interface ForgotPasswordErrors {
  email?: string;
  server?: string;
}

export interface UseForgotPasswordReturn {
  email: string;
  status: ForgotPasswordStatus;
  errors: ForgotPasswordErrors;
  isSubmitted: boolean;
  resendCooldown: number;
  isLoading: boolean;
  isSuccess: boolean;
  hasError: boolean;
  canResend: boolean;

  handleEmailChange: (value: string) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleResend: () => Promise<void>;
  resetForm: () => void;
  clearFieldError: (field: keyof ForgotPasswordErrors) => void;
}

const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Email address is required";
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address";
  if (trimmed.length > 254) return "Email address is too long";
  return undefined;
}

function parseServerError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (
      msg.includes("network") ||
      msg.includes("fetch") ||
      msg.includes("failed to fetch")
    ) {
      return "No internet connection. Please check your network and try again.";
    }

    if (
      msg.includes("rate") ||
      msg.includes("too many") ||
      msg.includes("429")
    ) {
      return "Too many attempts. Please wait a few minutes before trying again.";
    }

    if (
      msg.includes("not found") ||
      msg.includes("no user") ||
      msg.includes("404")
    ) {
      return "If an account with that email exists, you'll receive a reset link shortly.";
    }

    if (msg.includes("invalid email") || msg.includes("400")) {
      return "The email address you entered doesn't appear to be valid.";
    }

    if (
      msg.includes("500") ||
      msg.includes("server") ||
      msg.includes("internal")
    ) {
      return "Our servers are having trouble. Please try again in a moment.";
    }

    if (
      msg.includes("timeout") ||
      msg.includes("timed out") ||
      msg.includes("408")
    ) {
      return "The request timed out. Please check your connection and try again.";
    }

    if (!msg.match(/\d{3}/) && msg.length < 150) {
      return err.message;
    }
  }

  return "Something went wrong. Please try again in a moment.";
}

export function useForgotPassword(
  forgotPasswordExecute: (email: string) => Promise<void>,
): UseForgotPasswordReturn {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ForgotPasswordStatus>("idle");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);

    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current!);
          cooldownTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const submit = useCallback(
    async (emailToSubmit: string) => {
      const emailError = validateEmail(emailToSubmit);
      if (emailError) {
        setErrors({ email: emailError });
        setStatus("error");
        return;
      }

      setStatus("loading");
      setErrors({});

      try {
        await forgotPasswordExecute(emailToSubmit.trim().toLowerCase());
        setStatus("success");
        setIsSubmitted(true);
        startCooldown();
      } catch (err) {
        const serverError = parseServerError(err);
        setErrors({ server: serverError });
        setStatus("error");
      }
    },
    [forgotPasswordExecute, startCooldown],
  );

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);

      if (errors.email || errors.server) {
        setErrors({});
        if (status === "error") setStatus("idle");
      }
    },
    [errors, status],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      await submit(email);
    },
    [email, submit],
  );

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    await submit(email);
  }, [email, submit, resendCooldown]);

  const resetForm = useCallback(() => {
    setEmail("");
    setStatus("idle");
    setErrors({});
    setIsSubmitted(false);
    setResendCooldown(0);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
  }, []);

  const clearFieldError = useCallback((field: keyof ForgotPasswordErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return {
    email,
    status,
    errors,
    isSubmitted,
    resendCooldown,
    isLoading: status === "loading",
    isSuccess: status === "success",
    hasError: status === "error",
    canResend: resendCooldown === 0 && !status.includes("loading"),
    handleEmailChange,
    handleSubmit,
    handleResend,
    resetForm,
    clearFieldError,
  };
}
