import { CheckCircle2, Clock3, HelpCircle, XCircle, type LucideIcon } from "lucide-react";

export interface VerificationMeta {
  label: string;
  Icon: LucideIcon;
  className: string;
  iconClassName: string;
}

const VERIFICATION_MAP: Record<string, VerificationMeta> = {
  verified: {
    label: "Verified Company",
    Icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    iconClassName: "text-emerald-600",
  },
  pending: {
    label: "Awaiting Review",
    Icon: Clock3,
    className: "bg-amber-100 text-amber-800 border border-amber-200",
    iconClassName: "text-amber-600",
  },
  rejected: {
    label: "Verification Failed",
    Icon: XCircle,
    className: "bg-rose-100 text-rose-800 border border-rose-200",
    iconClassName: "text-rose-600",
  },
};

const UNKNOWN_VERIFICATION: VerificationMeta = {
  label: "Unknown",
  Icon: HelpCircle,
  className: "bg-slate-100 text-slate-700 border border-slate-200",
  iconClassName: "text-slate-500",
};

export function getVerificationMeta(status: string | undefined | null): VerificationMeta {
  return VERIFICATION_MAP[status?.toLowerCase() || ""] ?? UNKNOWN_VERIFICATION;
}

export function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

export function formatJoinedDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * "3 months ago" / "2 days ago" style relative label.
 * Computed client-side from joinedDate — no backend field required.
 */
export function formatRelativeJoined(dateStr: string | undefined | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 0) return null;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}