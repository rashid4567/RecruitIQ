import { AlertCircle, CheckCircle, Info } from "lucide-react";
import type { Severity } from "./Activitylog.helpers";

export const severityConfig: Record<
  Severity,
  {
    bg: string;
    border: string;
    icon: React.ElementType;
    color: string;
    badge: string;
  }
> = {
  error: {
    bg: "bg-rose-50/65",
    border: "border-l-4 border-rose-500/70",
    icon: AlertCircle,
    color: "text-rose-700",
    badge: "bg-rose-100 text-rose-800",
  },
  success: {
    bg: "bg-emerald-50/65",
    border: "border-l-4 border-emerald-500/70",
    icon: CheckCircle,
    color: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
  },
  info: {
    bg: "bg-blue-50/60",
    border: "border-l-4 border-blue-500/60",
    icon: Info,
    color: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
  },
  warning: {
    bg: "bg-amber-50/65",
    border: "border-l-4 border-amber-500/70",
    icon: AlertCircle,
    color: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
  },
};
