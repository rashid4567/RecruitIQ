import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  ShieldCheck,
  Lock,
  KeyRound,
  ShieldAlert,
  Info,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useUpdatePassword } from "@/module/auth/hooks/useUpdate.password";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Sidebar from "../../../components/admin/sideBar";

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  forceLogoutOtherSessions: boolean;
}

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(1, "Please enter your current password.")
      .max(100),
    newPassword: z
      .string()
      .min(8, "Must be at least 8 characters.")
      .regex(/[A-Z]/, "Must include an uppercase letter.")
      .regex(/[0-9]/, "Must include a number.")
      .regex(/[^A-Za-z0-9]/, "Must include a special character."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
    forceLogoutOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;
type FieldErrors = Partial<Record<keyof PasswordFormValues, string>>;

interface Rule {
  key: string;
  label: string;
  test: (value: string) => boolean;
}

const RULES: Rule[] = [
  { key: "length", label: "Minimum 8 characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "An uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "A number", test: (v) => /[0-9]/.test(v) },
  {
    key: "special",
    label: "A special character",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

function getStrengthMeta(passedCount: number) {
  if (passedCount <= 1)
    return {
      label: "Weak",
      color: "bg-red-500",
      text: "text-red-500",
      width: "25%",
      crackTime: "Instantly",
    };
  if (passedCount === 2)
    return {
      label: "Fair",
      color: "bg-amber-500",
      text: "text-amber-500",
      width: "50%",
      crackTime: "A few hours",
    };
  if (passedCount === 3)
    return {
      label: "Good",
      color: "bg-yellow-400",
      text: "text-yellow-600",
      width: "75%",
      crackTime: "A few months",
    };
  return {
    label: "Strong",
    color: "bg-emerald-500",
    text: "text-emerald-600",
    width: "100%",
    crackTime: "Centuries",
  };
}

// ---------- backend error mapping ----------

const ERROR_MESSAGE_MAP: Record<string, string> = {
  INVALID_CURRENT_PASSWORD: "The current password you entered is incorrect.",
  PASSWORD_REUSED: "Please choose a different password.",
  PASSWORD_TOO_WEAK: "Choose a stronger password.",
  RATE_LIMITED: "Too many attempts. Please wait a moment and try again.",
  NETWORK_ERROR: "We couldn't reach the server. Check your connection.",
};

function mapErrorMessage(raw: string | null): string | null {
  if (!raw) return null;
  return ERROR_MESSAGE_MAP[raw] ?? raw;
}

function isCurrentPasswordError(raw: string | null): boolean {
  if (!raw) return false;
  return (
    raw === "INVALID_CURRENT_PASSWORD" ||
    /current password/i.test(raw) ||
    /incorrect/i.test(raw)
  );
}

// ---------- password field ----------

interface PasswordFieldProps {
  id: string;
  label: string;
  hint?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onEnter?: () => void;
  error?: string;
  success?: string;
  autoComplete?: string;
  disablePaste?: boolean;
  onCapsLock?: (isOn: boolean) => void;
  showCapsWarning?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

function PasswordField({
  id,
  label,
  hint,
  placeholder,
  value,
  onChange,
  onBlur,
  onEnter,
  error,
  success,
  autoComplete = "off",
  disablePaste = false,
  onCapsLock,
  showCapsWarning = false,
  inputRef,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const shakeControls = useAnimation();
  const prevErrorRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      shakeControls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.4 },
      });
    }
    prevErrorRef.current = error;
  }, [error, shakeControls]);

  return (
    <motion.div animate={shakeControls}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <Lock
          size={16}
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            error
              ? "text-red-400"
              : focused
                ? "text-indigo-500"
                : "text-gray-350"
          }`}
        />
        <input
          id={id}
          name={id}
          ref={inputRef}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={(e) => {
            if (onCapsLock && "getModifierState" in e) {
              onCapsLock(
                (e as unknown as KeyboardEvent).getModifierState?.(
                  "CapsLock",
                ) ?? false,
              );
            }
            if (e.key === "Enter") onEnter?.();
          }}
          onPaste={disablePaste ? (e) => e.preventDefault() : undefined}
          onCopy={disablePaste ? (e) => e.preventDefault() : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onCapsLock?.(false);
            onBlur?.();
          }}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-white py-2.75 pl-10 pr-10 text-sm text-gray-900
            placeholder:text-gray-400 outline-none transition-all duration-150
            focus:ring-4
            ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                : success
                  ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-50"
                  : "border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-50"
            }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {hint && !error && !success && (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}

      <AnimatePresence mode="wait">
        {showCapsWarning && !error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-600"
          >
            <AlertTriangle size={12} className="shrink-0" />
            Caps Lock is on
          </motion.p>
        )}
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            id={`${id}-error`}
            className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
          >
            <X size={12} className="shrink-0" />
            {error}
          </motion.p>
        )}
        {!error && success && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600"
          >
            <Check size={12} className="shrink-0" />
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ConfirmUpdateDialog({
  open,
  onCancel,
  onConfirm,
  forceLogout,
  loading,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  forceLogout: boolean;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && !loading && onCancel()}>
      <DialogContent className="sm:max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <KeyRound size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Update password?
            </h2>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {forceLogout
                ? "Other devices will be signed out. This session will stay signed in."
                : "Your password will be updated immediately."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- success card ----------

function SuccessCard({ forceLogout }: { forceLogout: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100"
        >
          <ShieldCheck size={16} className="text-emerald-600" />
        </motion.div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-800">
            Password updated successfully
          </p>
          <ul className="mt-2 space-y-1 text-xs text-emerald-700">
            <li className="flex items-center gap-1.5">
              <Check size={12} className="shrink-0" />
              This session stays signed in — no need to log in again.
            </li>
            <li className="flex items-center gap-1.5">
              <Check size={12} className="shrink-0" />
              {forceLogout
                ? "Other active sessions have been signed out."
                : "Other devices remain signed in."}
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- main page ----------

export default function ChangeAdminPasswordPage() {
  const [values, setValues] = useState<PasswordFormValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    forceLogoutOtherSessions: true,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof PasswordFormValues, boolean>>
  >({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { handleUpdatePassword, loading, error, setError } =
    useUpdatePassword();

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const mappedError = mapErrorMessage(error);
  const currentPasswordServerError = isCurrentPasswordError(error)
    ? mappedError
    : null;

  const ruleStatus = useMemo(
    () =>
      RULES.map((rule) => ({ ...rule, passed: rule.test(values.newPassword) })),
    [values.newPassword],
  );
  const passedCount = ruleStatus.filter((r) => r.passed).length;
  const strength = getStrengthMeta(passedCount);

  const allRulesPassed = passedCount === RULES.length;
  const isFormFilled =
    values.currentPassword.length > 0 &&
    values.newPassword.length > 0 &&
    values.confirmPassword.length > 0;

  const passwordsMatch =
    values.confirmPassword.length > 0 &&
    values.newPassword === values.confirmPassword;
  const passwordsMismatch =
    values.confirmPassword.length > 0 &&
    values.newPassword !== values.confirmPassword;

  const canSubmit = isFormFilled && allRulesPassed && !loading;

  const setField = <K extends keyof PasswordFormValues>(
    key: K,
    value: PasswordFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (successMessage) setSuccessMessage(null);
    if (error) setError(null);

    // live-validate every keystroke once the field has been touched once
    if (touched[key]) {
      validateField(key, { ...values, [key]: value });
    }
  };

  const markTouched = (key: keyof PasswordFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key, values);
  };

  const validateField = (
    key: keyof PasswordFormValues,
    current: PasswordFormValues,
  ) => {
    const result = passwordSchema.safeParse(current);
    if (result.success) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
      return;
    }
    const issue = result.error.issues.find((i) => i.path[0] === key);
    setFieldErrors((prev) => ({ ...prev, [key]: issue?.message }));
  };

  const validateAll = (): boolean => {
    const result = passwordSchema.safeParse(values);
    if (result.success) {
      setFieldErrors({});
      return true;
    }
    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof PasswordFormValues;
      if (!errors[key]) errors[key] = issue.message;
    }
    setFieldErrors(errors);
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
      forceLogoutOtherSessions: true,
    });
    return false;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validateAll()) return;
    setConfirmOpen(true);
  };

  const performUpdate = async () => {
    const payload: UpdatePasswordPayload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
      forceLogoutOtherSessions: values.forceLogoutOtherSessions,
    };
    const ok = await handleUpdatePassword(payload);
    if (ok) {
      setConfirmOpen(false);
      setSuccessMessage("Your password has been updated successfully.");
      setValues((prev) => ({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        forceLogoutOtherSessions: prev.forceLogoutOtherSessions,
      }));
      setTouched({});
      setFieldErrors({});
      // No redirect and no forced logout of the current session here.
      // The backend is expected to invalidate only *other* sessions'
      // refresh tokens (when forceLogoutOtherSessions is true) and keep
      // this browser's session/access token valid, so the user can keep
      // working without being bounced back to the login page.
    } else {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-8 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Settings</span>
            <span>/</span>
            <span className="font-medium text-gray-900">
              Change Admin Password
            </span>
          </div>
        </header>
        <main className="px-8 py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-7 flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <KeyRound size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Change Your Admin Password
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Update your password to enhance account security.
                  </p>
                </div>
              </div>

              {mappedError && !currentPasswordServerError && (
                <div
                  role="alert"
                  className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  <ShieldAlert size={16} className="shrink-0" />
                  {mappedError}
                </div>
              )}

              <AnimatePresence>
                {successMessage && (
                  <SuccessCard forceLogout={values.forceLogoutOtherSessions} />
                )}
              </AnimatePresence>

              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <PasswordField
                  id="currentPassword"
                  label="Current Password"
                  hint="Enter your existing account password."
                  placeholder="Enter your current password"
                  value={values.currentPassword}
                  onChange={(v) => setField("currentPassword", v)}
                  onBlur={() => markTouched("currentPassword")}
                  onEnter={() => newPasswordRef.current?.focus()}
                  error={
                    touched.currentPassword
                      ? (fieldErrors.currentPassword ??
                        currentPasswordServerError ??
                        undefined)
                      : (currentPasswordServerError ?? undefined)
                  }
                  onCapsLock={setCapsLockOn}
                  showCapsWarning={capsLockOn}
                  autoComplete="current-password"
                />

                <hr className="border-gray-100" />

                <PasswordField
                  id="newPassword"
                  label="New Password"
                  placeholder="Create a new password"
                  value={values.newPassword}
                  onChange={(v) => setField("newPassword", v)}
                  onBlur={() => markTouched("newPassword")}
                  onEnter={() => confirmPasswordRef.current?.focus()}
                  error={
                    touched.newPassword ? fieldErrors.newPassword : undefined
                  }
                  onCapsLock={setCapsLockOn}
                  showCapsWarning={capsLockOn}
                  autoComplete="new-password"
                  inputRef={newPasswordRef}
                />

                <AnimatePresence>
                  {values.newPassword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="-mt-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Password strength
                        </p>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} />
                          Crack time: {strength.crackTime}
                        </span>
                      </div>
                      <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: strength.width }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-full ${strength.color}`}
                        />
                      </div>
                      <p
                        className={`mt-1.5 text-xs font-medium ${strength.text}`}
                      >
                        {strength.label} password
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <PasswordField
                  id="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  value={values.confirmPassword}
                  onChange={(v) => setField("confirmPassword", v)}
                  onBlur={() => markTouched("confirmPassword")}
                  onEnter={() => {
                    if (canSubmit)
                      onSubmit({ preventDefault() {} } as React.FormEvent);
                  }}
                  error={
                    touched.confirmPassword
                      ? (fieldErrors.confirmPassword ??
                        (passwordsMismatch
                          ? "Passwords do not match."
                          : undefined))
                      : undefined
                  }
                  success={
                    !touched.confirmPassword || !fieldErrors.confirmPassword
                      ? passwordsMatch
                        ? "Passwords match"
                        : undefined
                      : undefined
                  }
                  disablePaste
                  autoComplete="new-password"
                  inputRef={confirmPasswordRef}
                />

                <AnimatePresence>
                  {values.newPassword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl bg-gray-50 p-4"
                    >
                      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Your new password must contain
                      </p>
                      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {ruleStatus.map((rule) => (
                          <motion.li
                            key={rule.key}
                            initial={false}
                            animate={{ x: 0 }}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${
                              rule.passed ? "text-emerald-600" : "text-gray-400"
                            }`}
                          >
                            <motion.span
                              key={rule.passed ? "passed" : "unpassed"}
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                rule.passed ? "bg-emerald-100" : "bg-gray-200"
                              }`}
                            >
                              {rule.passed ? (
                                <Check size={11} className="text-emerald-600" />
                              ) : (
                                <X size={11} className="text-gray-400" />
                              )}
                            </motion.span>
                            {rule.label}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.75 text-sm font-medium text-white transition-all
                    ${
                      canSubmit
                        ? "bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow"
                        : "cursor-not-allowed bg-indigo-300 hover:bg-indigo-300"
                    }`}
                >
                  Update Password
                </Button>

                <p className="text-center text-xs text-gray-400">
                  Changing your password will immediately secure your account.
                </p>
              </form>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Info size={16} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    Password tips
                  </h2>
                </div>
                <ul className="space-y-2.5 text-sm text-gray-500">
                  <li>Avoid reusing passwords from other accounts.</li>
                  <li>
                    Use a passphrase of unrelated words instead of a single
                    word.
                  </li>
                  <li>Never share your admin password over email or chat.</li>
                  <li>
                    Update your password immediately if you suspect it was
                    exposed.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-600" />
                  <h2 className="text-sm font-semibold text-amber-800">
                    Heads up
                  </h2>
                </div>
                <p className="text-sm text-amber-700">
                  As an admin, changing your password with "Sign out from other
                  devices" enabled will end active sessions on all other devices
                  immediately. This browser session stays signed in.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <ConfirmUpdateDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={performUpdate}
        forceLogout={values.forceLogoutOtherSessions}
        loading={loading}
      />
    </div>
  );
}
