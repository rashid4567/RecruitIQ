import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,

  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, CheckCircle, Shield } from "lucide-react";

interface ProfileHeaderProps {
  subscriptionStatus?: string;
  verificationStatus: string;
}

export function ProfileHeader({ subscriptionStatus, verificationStatus }: ProfileHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "expired":
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "free":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatSubscriptionStatus = (status?: string) => {
    if (!status) return "Free";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <CardHeader className="pb-4 border-b border-slate-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <User className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-900 text-2xl">Recruiter Profile</CardTitle>
            <CardDescription>Manage your professional profile and company information</CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`px-3 py-1.5 border font-medium ${getStatusColor(subscriptionStatus || 'free')}`}
              >
                {subscriptionStatus === "active" && (
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                )}
                {formatSubscriptionStatus(subscriptionStatus)} Plan
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Your current subscription plan</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`px-3 py-1.5 border font-medium ${getStatusColor(verificationStatus)}`}
              >
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Account verification status</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </CardHeader>
  );
}