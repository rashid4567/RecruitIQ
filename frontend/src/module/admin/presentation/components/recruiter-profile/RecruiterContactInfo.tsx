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
import type { Recruiter } from "@/module/admin/domain/entities/recruiter.entity";

interface RecruiterContactInfoProps {
  recruiter: Recruiter;
  onVerify: () => void;
  onReject: () => void;
  onToggleActive: () => void;
  actionLoading: boolean;
}

function getInitials(name: string) {
  return (
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"
  );
}

const VERIFICATION_CONFIG = {
  pending:  { label: "Pending",  pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  verified: { label: "Verified", pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  rejected: { label: "Rejected", pill: "bg-red-50 text-red-600 ring-1 ring-red-200" },
} as const;

const SUBSCRIPTION_CONFIG = {
  free:    { label: "Free Plan",    pill: "bg-gray-50 text-gray-600 ring-1 ring-gray-200" },
  active:  { label: "Pro Active",   pill: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" },
  expired: { label: "Plan Expired", pill: "bg-orange-50 text-orange-600 ring-1 ring-orange-200" },
} as const;

export function RecruiterContactInfo({
  recruiter,
  onVerify,
  onReject,
  onToggleActive,
  actionLoading,
}: RecruiterContactInfoProps) {
  const verificationStyle =
    VERIFICATION_CONFIG[recruiter.verificationStatus] ?? VERIFICATION_CONFIG.pending;
  const subscriptionStyle =
    SUBSCRIPTION_CONFIG[recruiter.subscriptionStatus] ?? SUBSCRIPTION_CONFIG.free;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-300 via-gray-200 to-slate-300" />

      <div className="p-6 lg:p-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* ── Left: Identity ──────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-gray-50 shadow-md">
                <Avatar className="w-full h-full rounded-2xl">
                  <AvatarFallback className="bg-gray-900 text-white text-3xl font-bold rounded-2xl w-full h-full flex items-center justify-center">
                    {getInitials(recruiter.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span
                className={cn(
                  "absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white shadow-sm",
                  recruiter.isActive ? "bg-emerald-400" : "bg-red-400"
                )}
                title={recruiter.isActive ? "Active" : "Suspended"}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {recruiter.name}
              </h2>
              {recruiter.designation && (
                <p className="text-sm text-gray-400 mt-0.5">{recruiter.designation}</p>
              )}
              {recruiter.companyName && (
                <p className="text-sm font-semibold text-gray-700 mt-1">{recruiter.companyName}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${verificationStyle.pill}`}>
                {verificationStyle.label}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${subscriptionStyle.pill}`}>
                {subscriptionStyle.label}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  recruiter.isActive
                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                    : "bg-red-50 text-red-600 ring-1 ring-red-200"
                )}
              >
                {recruiter.isActive ? "Active" : "Suspended"}
              </span>
            </div>
          </div>

          {/* ── Right: Info + Actions ──────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        month: "short", day: "numeric", year: "numeric",
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

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
              {recruiter.verificationStatus === "pending" && (
                <>
                  <Button
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-sm h-9"
                    disabled={actionLoading}
                    onClick={onVerify}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify Recruiter
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 gap-2 text-sm h-9"
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
                  "rounded-xl gap-2 text-sm h-9",
                  recruiter.isActive
                    ? "border-red-200 text-red-500 hover:bg-red-50"
                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                )}
                disabled={actionLoading}
                onClick={onToggleActive}
              >
                {recruiter.isActive ? (
                  <><UserX className="h-4 w-4" /> Suspend</>
                ) : (
                  <><UserCheck className="h-4 w-4" /> Restore Access</>
                )}
              </Button>
            </div>
          </div>

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
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-900 hover:underline truncate block mt-0.5"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">{value}</p>
        )}
      </div>
    </div>
  );
}