import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Calendar,
  Eye,
  Gem,
  Briefcase,
  Mail,
  MoreVertical,
  Shield,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";
import type { RecruiterAction } from "./RecruiterActionDialog";
import {
  formatJoinedDate,
  formatRelativeJoined,
  getInitials,
  getVerificationMeta,
} from "./recruiter.helpers"

interface RecruiterCardProps {
  recruiter: RecruiterProfile;
  isActionLoading?: boolean;
  onAction: (recruiter: RecruiterProfile, action: RecruiterAction) => void;
  onViewProfile: (recruiterId: string) => void;
}

export function RecruiterCard({
  recruiter,
  isActionLoading = false,
  onAction,
  onViewProfile,
}: RecruiterCardProps) {
  const isActive = recruiter.isActive ?? true;
  const isPending = recruiter.verificationStatus?.toLowerCase() === "pending";

  const badge = getVerificationMeta(recruiter.verificationStatus);
  const BadgeIcon = badge.Icon;

  const companyName = recruiter.companyName || recruiter.name || "—";
  const contactName = recruiter.name || null;
  const initials = getInitials(companyName);

  const joined = formatJoinedDate(recruiter.joinedDate);
  const relativeJoined = formatRelativeJoined(recruiter.joinedDate);

  const jobsPosted = recruiter.jobPostsUsed || 0;

  const handleViewProfile = () => {
    if (recruiter.id) onViewProfile(recruiter.id);
  };

  return (
    <div
      className="
        rounded-2xl border border-slate-200 bg-white
        p-5 shadow-sm
        transition-all duration-200
        hover:-translate-y-1 hover:border-indigo-300
        hover:shadow-md hover:ring-2 hover:ring-indigo-100
      "
    >
      {/* Identity block: avatar, company, contact, verification */}
      <div className="flex min-h-20 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0 shadow-sm ring-2 ring-white">
            <AvatarFallback
              className={cn(
                "text-sm font-semibold text-white",
                isActive
                  ? "bg-linear-to-br from-emerald-500 to-emerald-600"
                  : "bg-linear-to-br from-rose-500 to-rose-600",
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900">
              {companyName}
            </div>

            {contactName && (
              <div className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                <User className="h-3 w-3 shrink-0" />
                {contactName}
              </div>
            )}

            <div className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
              <Mail className="h-3 w-3 shrink-0" />
              {recruiter.email}
            </div>
          </div>
        </div>

        <Badge
          className={cn(
            "shrink-0 gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            badge.className,
          )}
        >
          <BadgeIcon className={cn("h-3 w-3", badge.iconClassName)} />
          {badge.label}
        </Badge>
      </div>

      <div className="my-4 h-px bg-slate-100" />

      {/* Info grid: each cell is its own mini-card */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-lg bg-violet-50/70 p-2.5">
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-violet-500">
            <Gem className="h-3 w-3" />
            Plan
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold text-violet-800">
            {recruiter.subscriptionStatus || "No plan"}
          </div>
        </div>

        <div className="rounded-lg bg-blue-50/70 p-2.5">
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-blue-500">
            <Briefcase className="h-3 w-3" />
            Jobs
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold text-blue-800">
            {jobsPosted} Posted
          </div>
        </div>

        <div
          className={cn(
            "rounded-lg p-2.5",
            isActive ? "bg-emerald-50/70" : "bg-rose-50/70",
          )}
        >
          <div
            className={cn(
              "text-[10px] font-medium uppercase tracking-wide",
              isActive ? "text-emerald-500" : "text-rose-500",
            )}
          >
            Status
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2 shrink-0">
              {isActive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  isActive ? "bg-emerald-500" : "bg-rose-500",
                )}
              />
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                isActive ? "text-emerald-800" : "text-rose-800",
              )}
            >
              {isActive ? "Active" : "Blocked"}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5">
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            <Calendar className="h-3 w-3" />
            Joined
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold text-slate-700">
            {joined}
          </div>
          {relativeJoined && (
            <div className="truncate text-[10px] text-slate-400">
              {relativeJoined}
            </div>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-slate-100" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          className="h-11 flex-1 gap-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={handleViewProfile}
          disabled={isActionLoading || !recruiter.id}
        >
          <Eye className="h-4 w-4" />
          View Profile
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-11 w-11 rounded-lg p-0"
              disabled={isActionLoading}
              aria-label="More actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleViewProfile} disabled={!recruiter.id}>
              <Eye className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {isPending && (
              <>
                <DropdownMenuLabel className="text-xs font-semibold text-slate-600">
                  Verification
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onAction(recruiter, "verify")}
                  className="text-emerald-600 focus:text-emerald-600"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Verify
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction(recruiter, "reject")}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuLabel className="text-xs font-semibold text-slate-600">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onAction(recruiter, isActive ? "block" : "unblock")}
            >
              {isActive ? (
                <>
                  <Ban className="mr-2 h-4 w-4" /> Block Recruiter
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" /> Unblock Recruiter
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}