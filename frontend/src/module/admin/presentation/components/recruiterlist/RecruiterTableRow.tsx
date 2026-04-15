import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, ShieldCheck, XCircle, Ban, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface RecruiterTableRowProps {
  recruiter: any;
  isActionLoading?: boolean;
  onAction: (recruiter: any, action: string) => void;
  onViewProfile: (recruiterId: string) => void;   // ← Added for consistency with CandidateRow
}

export function RecruiterTableRow({
  recruiter,
  isActionLoading = false,
  onAction,
  onViewProfile,
}: RecruiterTableRowProps) {
  
  const isActive = recruiter.isActive ?? true;

  const getVerificationBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return { label: "Verified", className: "bg-emerald-100 text-emerald-800 border border-emerald-200" };
      case "pending":
        return { label: "Pending", className: "bg-amber-100 text-amber-800 border border-amber-200" };
      case "rejected":
        return { label: "Rejected", className: "bg-rose-100 text-rose-800 border border-rose-200" };
      default:
        return { label: "Unknown", className: "bg-slate-100 text-slate-700 border border-slate-200" };
    }
  };

  const badge = getVerificationBadge(recruiter.verificationStatus);

  const initials = (recruiter.companyName || recruiter.name || "")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const recruiterId = recruiter._id || recruiter.id;

  const handleViewProfile = () => {
    if (recruiterId) {
      onViewProfile(recruiterId);
    } else {
      console.error("Recruiter ID is missing");
    }
  };

  return (
    <tr className="hover:bg-indigo-50/30 transition-colors duration-200 group border-b last:border-0">
      {/* Recruiter Info */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3.5">
          <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
            <AvatarFallback
              className={cn(
                "text-white font-semibold text-sm",
                isActive 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600" 
                  : "bg-gradient-to-br from-rose-500 to-rose-600"
              )}
            >
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-slate-900 truncate max-w-[220px]">
              {recruiter.companyName || recruiter.name}
            </div>
            <div className="text-sm text-slate-500 mt-0.5 truncate max-w-[220px]">
              {recruiter.email}
            </div>
          </div>
        </div>
      </td>

      {/* Verification Status */}
      <td className="px-5 py-5">
        <Badge 
          className={cn(
            "px-3.5 py-1 text-xs font-medium rounded-full",
            badge.className
          )}
        >
          {badge.label}
        </Badge>
      </td>

      {/* Subscription */}
      <td className="px-5 py-5">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
          {recruiter.subscriptionStatus || "—"}
        </Badge>
      </td>

      {/* Jobs Posted */}
      <td className="px-5 py-5 text-center font-medium text-slate-700">
        {recruiter.jobPostsUsed || 0}
      </td>

      {/* Status */}
      <td className="px-5 py-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-white",
              isActive ? "bg-emerald-500 ring-emerald-300/50" : "bg-rose-500 ring-rose-300/50"
            )}
          />
          <Badge
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full",
              isActive
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800"
            )}
          >
            {isActive ? "Active" : "Blocked"}
          </Badge>
        </div>
      </td>

      {/* Joined Date */}
      <td className="px-5 py-5 text-slate-600 text-sm">
        {recruiter.joinedDate 
          ? new Date(recruiter.joinedDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) 
          : "—"
        }
      </td>

      {/* Actions */}
      <td className="px-6 py-5 text-right pr-8">
        <div className="flex items-center justify-end gap-2">
          {/* View Profile Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
            onClick={handleViewProfile}
            disabled={isActionLoading || !recruiterId}
            title="View Recruiter Profile"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700"
                disabled={isActionLoading}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {recruiter.verificationStatus === "pending" && (
                <>
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
                </>
              )}

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
      </td>
    </tr>
  );
}