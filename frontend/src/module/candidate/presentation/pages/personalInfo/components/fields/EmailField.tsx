import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Shield,
  Loader2,
} from "lucide-react";

interface EmailFieldProps {
  isEditing: boolean;
  email: string;
  profileEmail: string;
  emailVerified?: boolean;
  validationError?: string;
  sendingOtp?: boolean;
  onEmailChange: (email: string) => void;
  onVerifyClick: (email: string) => void;
}

export function EmailField({
  isEditing,
  email,
  profileEmail,
  emailVerified = false,
  validationError,
  sendingOtp = false,
  onEmailChange,
  onVerifyClick,
}: EmailFieldProps) {
  /* ───────────────── VIEW MODE ───────────────── */
  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <Mail className="h-4 w-4 text-slate-400 shrink-0" />

        <span className="text-slate-900 flex-1 truncate">
          {profileEmail}
        </span>

        
      </div>
    );
  }

  /* ───────────────── EDIT MODE ───────────────── */

  const trimmedEmail = email.trim();
  const trimmedProfileEmail = profileEmail.trim();

  const isNewEmail =
    trimmedEmail.length > 0 &&
    trimmedEmail.toLowerCase() !== trimmedProfileEmail.toLowerCase();

  const hasValidationError = Boolean(validationError?.length);

  const canVerify =
    isNewEmail && !hasValidationError && !sendingOtp;

  const handleVerifyClick = () => {
    console.log("VERIFY CLICKED");
    if (!canVerify) return;
    onVerifyClick(trimmedEmail);
  };

  return (
    <div className="space-y-2 relative z-10">
      <div className="flex items-start gap-3">
        {/* Email Input */}
        <div className="relative flex-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoComplete="off"
            placeholder="Enter your email"
            className={`pl-10 h-12 ${
              hasValidationError
                ? "border-red-500 focus:ring-red-500/20"
                : isNewEmail
                ? "border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            }`}
          />

          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />

          {validationError && (
            <p className="text-xs text-red-500 mt-1">
              {validationError}
            </p>
          )}
        </div>

        {/* Verify Button */}
        <Button
          type="button"
          onClick={handleVerifyClick}
          disabled={!canVerify}
          className="h-12 whitespace-nowrap"
        >
          {sendingOtp ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-1">
        {isNewEmail ? (
          <>
            <AlertCircle className="h-3 w-3" />
            New email detected — click Verify
          </>
        ) : (
          <>
            <Shield className="h-3 w-3" />
            Change your email and click Verify
          </>
        )}
      </p>
    </div>
  );
}
