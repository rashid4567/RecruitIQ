
import { AlertCircle, CheckCircle, X } from "lucide-react";
import type { AuthError } from "../../types/auth.error";

interface AuthAlertProps {
  error: AuthError | null;
  success: string;
  onClose: () => void;
}

export function AuthAlert({ error, success, onClose }: AuthAlertProps) {
  if (!error && !success) return null;

  return (
    <div className="mb-6">
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            error.type === "blocked"
              ? "bg-red-50 border-red-300 text-red-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm pr-2">{error.message}</div>

          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition-colors shrink-0"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}