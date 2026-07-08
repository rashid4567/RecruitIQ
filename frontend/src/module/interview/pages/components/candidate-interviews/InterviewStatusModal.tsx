import type { LucideIcon } from "lucide-react";
import { AlertTriangle, XCircle, Info, X, RotateCcw } from "lucide-react";
import type { InterviewStatusModalType } from "./interviewStatusMessages";

interface InterviewStatusModalProps {
  open: boolean;
  title: string;
  message: string;
  type: InterviewStatusModalType;
  retryable?: boolean;
  retryLoading?: boolean;
  onRetry?: () => void;
  onClose: () => void;
}


const TYPE_STYLES: Record<
  InterviewStatusModalType,
  {
    icon: LucideIcon;
    iconWrap: string;
    iconColor: string;
  }
> = {
  warning: {
    icon: AlertTriangle,
    iconWrap: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  error: {
    icon: XCircle,
    iconWrap: "bg-red-50",
    iconColor: "text-red-500",
  },
  info: {
    icon: Info,
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-500",
  },
};

export default function InterviewStatusModal({
  open,
  title,
  message,
  type,
  retryable = false,
  retryLoading = false,
  onRetry,
  onClose,
}: InterviewStatusModalProps) {
  if (!open) return null;

  const { icon: Icon, iconWrap, iconColor } = TYPE_STYLES[type];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-7 pb-6 flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconWrap}`}>
            <Icon size={22} className={iconColor} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>

        <div className="px-6 pb-6 flex items-center gap-2">
          {retryable && onRetry && (
            <button
              onClick={onRetry}
              disabled={retryLoading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw size={14} className={retryLoading ? "animate-spin" : ""} />
              {retryLoading ? "Retrying…" : "Retry"}
            </button>
          )}
          <button
            onClick={onClose}
            className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              retryable
                ? "flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "w-full bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}