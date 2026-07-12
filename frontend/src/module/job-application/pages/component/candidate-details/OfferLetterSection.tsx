import { FileText, ExternalLink, Clock, Send, CheckCircle2, XCircle, Ban, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionCard } from "./Sectioncard";
import type { OfferSummary } from "../../../types/jobApplication.types";
import type { OfferStatus } from "@/module/offer-letter/types/candidateOffer.types";

interface OfferLetterSectionProps {
  offer: OfferSummary;
}

interface StatusVisual {
  label: string;
  helper: string;
  icon: typeof Send;
  dot: string;
  badgeBg: string;
  badgeText: string;
  tint: string;
  ring: string;
}

const STATUS_CONFIG: Record<OfferStatus, StatusVisual> = {
  SENT: {
    label: "Sent",
    helper: "Awaiting your response",
    icon: Send,
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    tint: "from-emerald-50/70 to-white",
    ring: "ring-emerald-100",
  },
  VIEWED: {
    label: "Viewed",
    helper: "Awaiting your response",
    icon: Eye,
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    tint: "from-emerald-50/70 to-white",
    ring: "ring-emerald-100",
  },
  ACCEPTED: {
    label: "Accepted",
    helper: "You accepted this offer",
    icon: CheckCircle2,
    dot: "bg-blue-500",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    tint: "from-blue-50/70 to-white",
    ring: "ring-blue-100",
  },
  REJECTED: {
    label: "Rejected",
    helper: "You declined this offer",
    icon: XCircle,
    dot: "bg-red-500",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    tint: "from-red-50/60 to-white",
    ring: "ring-red-100",
  },
  EXPIRED: {
    label: "Expired",
    helper: "This offer is no longer active",
    icon: Clock,
    dot: "bg-slate-400",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    tint: "from-slate-50 to-white",
    ring: "ring-slate-100",
  },
  REVOKED: {
    label: "Revoked",
    helper: "This offer was withdrawn by the recruiter",
    icon: Ban,
    dot: "bg-slate-400",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    tint: "from-slate-50 to-white",
    ring: "ring-slate-100",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(iso: string): number {
  const diffMs = new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / 86400000);
}

function countdownLabel(remaining: number, isPastDue: boolean): string {
  if (isPastDue) {
    const overdue = Math.abs(remaining);
    return overdue === 0 ? "Expired today" : `Expired ${overdue} day${overdue === 1 ? "" : "s"} ago`;
  }
  if (remaining === 0) return "Expires today";
  if (remaining === 1) return "Expires tomorrow";
  return `${remaining} days left`;
}

export function OfferLetterSection({ offer }: OfferLetterSectionProps) {
  const navigate = useNavigate();
  const remaining = daysLeft(offer.expiryDate);
  const isPastDue = remaining < 0 && (offer.status === "SENT" || offer.status === "VIEWED");
  const effectiveStatus: OfferStatus = isPastDue ? "EXPIRED" : offer.status;
  const cfg = STATUS_CONFIG[effectiveStatus];
  const Icon = cfg.icon;

  const isPending = effectiveStatus === "SENT" || effectiveStatus === "VIEWED";
  const isClosed = effectiveStatus === "ACCEPTED" || effectiveStatus === "REJECTED" || effectiveStatus === "REVOKED";
  const isUrgent = isPending && remaining <= 3;

  return (
    <SectionCard title="Offer letter" icon={<FileText className="w-4 h-4" />}>
      <div className={`-mx-6 px-6 pt-4 pb-5 mt-4 bg-gradient-to-b ${cfg.tint}`}>
        {/* Status header */}
        <div className="flex items-start justify-between gap-3 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 ${cfg.badgeText} ring-4 ${cfg.ring}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isUrgent ? "animate-pulse" : ""}`} />
                <span className={`text-sm font-semibold ${cfg.badgeText}`}>{cfg.label}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{cfg.helper}</p>
            </div>
          </div>

          {isUrgent && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              {countdownLabel(remaining, isPastDue)}
            </span>
          )}
        </div>

        {/* Info rows */}
        <div className="rounded-2xl bg-white/70 border border-slate-100 divide-y divide-slate-100">
          {!isClosed && (
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {effectiveStatus === "EXPIRED" ? "Expired on" : "Expires on"}
              </p>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">{formatDate(offer.expiryDate)}</p>
                {!isUrgent && (
                  <p className="text-[11px] text-slate-400 font-medium">{countdownLabel(remaining, isPastDue)}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Offer letter</p>
            <button
              onClick={() => navigate(offer.offerLetterUrl)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${cfg.badgeBg} ${cfg.badgeText} hover:brightness-95`}
            >
              View offer letter
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}