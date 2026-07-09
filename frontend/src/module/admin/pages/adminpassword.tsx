import { useMemo, useState } from "react";
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
} from "lucide-react";
import { useUpdatePassword } from "@/module/auth/hooks/useUpdate.password";
import { Button } from "@/components/ui/button";
import Sidebar from "../../../components/admin/sideBar";

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  forceLogoutOtherSessions: boolean;
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
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
    };
  if (passedCount === 2)
    return {
      label: "Fair",
      color: "bg-amber-500",
      text: "text-amber-500",
      width: "50%",
    };
  if (passedCount === 3)
    return {
      label: "Good",
      color: "bg-yellow-400",
      text: "text-yellow-600",
      width: "75%",
    };
  return {
    label: "Strong",
    color: "bg-emerald-500",
    text: "text-emerald-600",
    width: "100%",
  };
}

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  autoComplete = "off",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div>
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
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
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
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
        >
          <X size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

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

  const { handleUpdatePassword, loading, error, setError } =
    useUpdatePassword();

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

  const canSubmit = isFormFilled && allRulesPassed && !loading;

  const setField = <K extends keyof PasswordFormValues>(
    key: K,
    value: PasswordFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (successMessage) setSuccessMessage(null);
    if (error) setError(null);
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
      setFieldErrors({});
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateAll()) return;

    const payload: UpdatePasswordPayload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
      forceLogoutOtherSessions: values.forceLogoutOtherSessions,
    };
    const ok = await handleUpdatePassword(payload);
    if (ok) {
      setSuccessMessage("Your password has been updated successfully.");
      setValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        forceLogoutOtherSessions: true,
      });
      setTouched({});
      setFieldErrors({});
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
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
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  <ShieldAlert size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              {successMessage && (
                <div
                  role="status"
                  className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  <ShieldCheck size={16} className="shrink-0" />
                  {successMessage}
                </div>
              )}

              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <PasswordField
                  id="currentPassword"
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={values.currentPassword}
                  onChange={(v) => setField("currentPassword", v)}
                  onBlur={() => markTouched("currentPassword")}
                  error={
                    touched.currentPassword
                      ? fieldErrors.currentPassword
                      : undefined
                  }
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
                  error={
                    touched.newPassword ? fieldErrors.newPassword : undefined
                  }
                  autoComplete="new-password"
                />

                {values.newPassword.length > 0 && (
                  <div className="-mt-2">
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p
                      className={`mt-1.5 text-xs font-medium ${strength.text}`}
                    >
                      {strength.label} password
                    </p>
                  </div>
                )}

                <PasswordField
                  id="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  value={values.confirmPassword}
                  onChange={(v) => setField("confirmPassword", v)}
                  onBlur={() => markTouched("confirmPassword")}
                  error={
                    touched.confirmPassword
                      ? fieldErrors.confirmPassword
                      : undefined
                  }
                  autoComplete="new-password"
                />

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Your new password must contain
                  </p>
                  <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {ruleStatus.map((rule) => (
                      <li
                        key={rule.key}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          rule.passed ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            rule.passed ? "bg-emerald-100" : "bg-gray-200"
                          }`}
                        >
                          {rule.passed ? (
                            <Check size={11} className="text-emerald-600" />
                          ) : (
                            <X size={11} className="text-gray-400" />
                          )}
                        </span>
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>

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
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Updating password..." : "Update Password"}
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
                  As an admin, changing your password with "force logout"
                  enabled will end active sessions on all other devices
                  immediately.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
