// components/recruiter-profile/RecruiterContactInfo.tsx
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

const VERIFICATION_CONFIG = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-800" },
  verified: { label: "Verified", bg: "bg-emerald-100", text: "text-emerald-800" },
  rejected: { label: "Rejected", bg: "bg-rose-100", text: "text-rose-800" },
} as const;

const SUBSCRIPTION_CONFIG = {
  free: { label: "Free Plan", bg: "bg-slate-100", text: "text-slate-700" },
  active: { label: "Pro Active", bg: "bg-blue-100", text: "text-blue-800" },
  expired: { label: "Plan Expired", bg: "bg-orange-100", text: "text-orange-800" },
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
    <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6 lg:p-10">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* ── Avatar + Name + Badges ── */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
            <div className="relative group">
              <Avatar className="h-28 w-28 ring-2 ring-white shadow-xl transition-transform group-hover:scale-105">
                <AvatarFallback className="bg-linear-to-br from-indigo-500 to-violet-600 text-white text-4xl font-bold">
                  {getInitials(recruiter.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm",
                  recruiter.isActive ? "bg-emerald-500" : "bg-rose-500"
                )}
                title={recruiter.isActive ? "Active" : "Suspended"}
              />
            </div>

            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                {recruiter.name}
              </h2>
              {recruiter.designation && (
                <p className="text-sm text-slate-500 mt-0.5 font-medium">
                  {recruiter.designation}
                </p>
              )}
              {recruiter.companyName && (
                <p className="text-base text-slate-700 mt-1 font-semibold">
                  {recruiter.companyName}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge className={cn("px-3 py-1 text-sm font-medium", verificationStyle.bg, verificationStyle.text)}>
                {verificationStyle.label}
              </Badge>
              <Badge className={cn("px-3 py-1 text-sm font-medium", subscriptionStyle.bg, subscriptionStyle.text)}>
                {subscriptionStyle.label}
              </Badge>
            </div>
          </div>

          {/* ── Contact Info + Actions ── */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

            {/* ── Action Buttons ── */}
            <div className="flex flex-wrap gap-3">
              {recruiter.verificationStatus === "pending" && (
                <>
                  <Button
                    className="h-11 bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2"
                    disabled={actionLoading}
                    onClick={onVerify}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify Recruiter
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 border-rose-300 text-rose-700 hover:bg-rose-50 gap-2"
                    disabled={actionLoading}
                    onClick={onReject}
                  >
                    <ShieldX className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              <Button
                variant={recruiter.isActive ? "outline" : "default"}
                className={cn(
                  "h-11 shadow-sm gap-2",
                  recruiter.isActive
                    ? "border-rose-300 text-rose-700 hover:bg-rose-50"
                    : "bg-emerald-600 hover:bg-emerald-700"
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
      </CardContent>
    </Card>
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
      <div className="rounded-lg bg-slate-100 p-2.5 mt-0.5 shrink-0">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline truncate block mt-0.5"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-slate-900 mt-0.5 truncate">{value}</p>
        )}
      </div>
    </div>
  );
}