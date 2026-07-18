import {
  Mail,
  MapPin,
  CalendarDays,
  ShieldCheck,
  ShieldX,
  UserX,
  UserCheck,
  Linkedin,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";

interface RecruiterContactInfoProps {
  recruiter: RecruiterProfile;
  onVerify: () => void;
  onReject: () => void;
  onToggleActive: () => void;
  actionLoading: boolean;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

const VERIFICATION_CONFIG = {
  pending: {
    label: "Pending Review",
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
  },
  verified: {
    label: "Verified",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    pill: "bg-red-50 text-red-600 ring-1 ring-red-200",
    dot: "bg-red-500",
  },
} as const;

const SUBSCRIPTION_CONFIG = {
  free: {
    label: "Free Plan",
    pill: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
  },
  active: {
    label: "Pro Active",
    pill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  expired: {
    label: "Plan Expired",
    pill: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
    dot: "bg-orange-500",
  },
} as const;

export function RecruiterContactInfo({
  recruiter,
  onVerify,
  onReject,
  onToggleActive,
  actionLoading,
}: RecruiterContactInfoProps) {
  const verificationStyle =
    VERIFICATION_CONFIG[recruiter.verificationStatus] ??
    VERIFICATION_CONFIG.pending;
  const subscriptionStyle =
    SUBSCRIPTION_CONFIG[recruiter.subscriptionStatus] ??
    SUBSCRIPTION_CONFIG.free;

  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Gradient banner */}
      <div className="h-24 sm:h-28 w-full bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-500 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
      </div>

      <div className="px-5 sm:px-8 pb-6 sm:pb-8">
        {/* Avatar overlapping the banner */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg bg-white">
              <Avatar className="w-full h-full rounded-2xl">
                <AvatarFallback className="bg-linear-to-br from-slate-800 to-slate-900 text-white text-3xl font-bold rounded-2xl w-full h-full flex items-center justify-center">
                  {getInitials(recruiter.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <span
              className={cn(
                "absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center",
                recruiter.isActive ? "bg-emerald-500" : "bg-red-500",
              )}
              title={recruiter.isActive ? "Active" : "Suspended"}
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left pt-2 sm:pt-0 sm:pb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
              {recruiter.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5 mt-0.5">
              {recruiter.designation && (
                <p className="text-sm text-slate-400">{recruiter.designation}</p>
              )}
              {recruiter.designation && recruiter.companyName && (
                <span className="text-slate-300 hidden sm:inline">•</span>
              )}
              {recruiter.companyName && (
                <p className="text-sm font-semibold text-slate-700">
                  {recruiter.companyName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full",
              verificationStyle.pill,
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", verificationStyle.dot)} />
            {verificationStyle.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full",
              subscriptionStyle.pill,
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", subscriptionStyle.dot)} />
            {subscriptionStyle.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full",
              recruiter.isActive
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-600 ring-1 ring-red-200",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                recruiter.isActive ? "bg-emerald-500" : "bg-red-500",
              )}
            />
            {recruiter.isActive ? "Active" : "Suspended"}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7 pt-6 border-t border-slate-100">
          <InfoItem icon={Mail} label="Email" value={recruiter.email} />
          {recruiter.location && (
            <InfoItem icon={MapPin} label="Location" value={recruiter.location} />
          )}
          <InfoItem
            icon={CalendarDays}
            label="Joined"
            value={
              recruiter.joinedDate
                ? new Date(recruiter.joinedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"
            }
          />
          {recruiter.linkedinUrl && (
            <InfoItem
              icon={Linkedin}
              label="LinkedIn"
              value="View Profile"
              href={recruiter.linkedinUrl}
            />
          )}
          <InfoItem
            icon={BadgeCheck}
            label="Job Posts Used"
            value={String(recruiter.jobPostsUsed)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5 pt-6 mt-6 border-t border-slate-100">
          {recruiter.verificationStatus === "pending" && (
            <>
              <Button
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-sm h-10 px-4 shadow-sm shadow-emerald-500/20"
                disabled={actionLoading}
                onClick={onVerify}
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Recruiter
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 gap-2 text-sm h-10 px-4"
                disabled={actionLoading}
                onClick={onReject}
              >
                <ShieldX className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}

          <Button
            variant="outline"
            className={cn(
              "rounded-xl gap-2 text-sm h-10 px-4",
              recruiter.isActive
                ? "border-red-200 text-red-500 hover:bg-red-50"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
            )}
            disabled={actionLoading}
            onClick={onToggleActive}
          >
            {recruiter.isActive ? (
              <>
                <UserX className="h-4 w-4" /> Suspend
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" /> Restore Access
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
 return (
  <div className="flex items-start gap-3 group">
    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:bg-indigo-100">
      <Icon className="h-4 w-4 text-indigo-500" />
    </div>

    <div className="min-w-0">
      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
        {label}
      </p>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline truncate block mt-0.5"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
          {value}
        </p>
      )}
    </div>
  </div>
);
}