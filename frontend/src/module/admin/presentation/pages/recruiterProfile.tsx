import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  CalendarDays,
  Download,
  Building2,
  FileText,
  BriefcaseBusiness,
  ShieldCheck,
  ShieldX,
  Hash,
  User,
} from "lucide-react";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { Recruiter } from "../../domain/entities/recruiter.entity";
import {
  getRecruiterProfileUC,
  verifyRecruiterUC,
  rejectRecruiterUC,
} from "../di/recruiter.di";
import { blockUserUC, unblockUserUC } from "../di/user.di";



const statusVariants: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  verified: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
};

const statusIcons: Record<string, LucideIcon> = {
  pending: Clock,
  verified: CheckCircle2,
  rejected: XCircle,
};

function accountStatusVariant(active: boolean) {
  return active
    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
    : "bg-rose-50 text-rose-800 border-rose-200";
}



export default function RecruiterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getRecruiterProfileUC.execute(id);
        setRecruiter(data);
      } catch {
        setRecruiter(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!recruiter) return;
    setActionLoading(true);
    try {
      if (recruiter.isActive) {
        await blockUserUC.execute(recruiter.id);
        setRecruiter(recruiter.withActiveStatus(false));
      } else {
        await unblockUserUC.execute(recruiter.id);
        setRecruiter(recruiter.withActiveStatus(true));
      }
    } finally {
      setActionLoading(false);
      setShowBlockModal(false);
    }
  };

  const handleVerify = async () => {
    if (!recruiter) return;
    setActionLoading(true);
    try {
      await verifyRecruiterUC.execute(recruiter.id);
      setRecruiter(recruiter.withVerificationStatus("verified"));
    } finally {
      setActionLoading(false);
      setShowVerifyModal(false);
    }
  };

  const handleReject = async () => {
    if (!recruiter) return;
    setActionLoading(true);
    try {
      await rejectRecruiterUC.execute(recruiter.id);
      setRecruiter(recruiter.withVerificationStatus("rejected"));
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 text-gray-500">
            <Loader2 className="h-14 w-14 animate-spin text-indigo-600" />
            <span className="text-sm font-medium">Loading recruiter profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="min-h-screen bg-gray-50/70 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <AlertCircle className="h-20 w-20 text-gray-300" />
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-700">Recruiter not found</h2>
            <p className="mt-3 text-gray-600">
              The profile you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/recruiters")}>
            Return to Recruiters List
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[recruiter.verificationStatus] ?? Clock;

  return (
    <div className="min-h-screen bg-gray-50/70 flex">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <button
                onClick={() => navigate("/admin/recruiters")}
                className="group inline-flex items-center text-sm text-gray-600 hover:text-indigo-700 transition-colors mb-1.5"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to list
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-indigo-600" />
                Recruiter Profile
              </h1>
            </div>

            <Button variant="outline" size="sm" className="gap-2 border-gray-300">
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
          </div>

          {/* Hero Card */}
          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left – Avatar & Name */}
                <div className="flex flex-col items-center lg:items-start gap-5 min-w-50">
                  <div className="relative">
                    <img
                      src={
                        recruiter.profileImage ??
                        `https://api.dicebear.com/7.x/initials/svg?seed=${recruiter.name}&backgroundColor=6366f1&textColor=ffffff&fontFamily=Verdana`
                      }
                      alt=""
                      className="w-32 h-32 rounded-2xl object-cover shadow-md ring-1 ring-gray-200"
                    />
                    <div
                      className={cn(
                        "absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                        recruiter.isActive ? "bg-emerald-500" : "bg-rose-500"
                      )}
                    />
                  </div>

                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                      {recruiter.name}
                    </h2>
                    <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-3.5 py-1.5 text-sm font-medium flex items-center gap-1.5 shadow-sm",
                          statusVariants[recruiter.verificationStatus]
                        )}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {recruiter.verificationStatus.charAt(0).toUpperCase() +
                          recruiter.verificationStatus.slice(1)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "px-3.5 py-1.5 text-sm font-medium shadow-sm",
                          accountStatusVariant(recruiter.isActive)
                        )}
                      >
                        {recruiter.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Right – Contact + Actions */}
                <div className="flex-1 space-y-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2.5">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
                        <p className="font-medium text-gray-900 mt-0.5">{recruiter.email}</p>
                      </div>
                    </div>

                    {recruiter.location && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2.5">
                          <MapPin className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                          <p className="font-medium text-gray-900 mt-0.5">{recruiter.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <Button
                      variant={recruiter.isActive ? "outline" : "default"}
                      size="lg"
                      className={cn(
                        "min-w-40 transition-all",
                        recruiter.isActive
                          ? "border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      )}
                      onClick={() => setShowBlockModal(true)}
                      disabled={actionLoading}
                    >
                      {recruiter.isActive ? (
                        <>
                          <UserX className="mr-2 h-4.5 w-4.5" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4.5 w-4.5" />
                          Restore
                        </>
                      )}
                    </Button>

                    {recruiter.verificationStatus === "pending" && (
                      <>
                        <Button
                          size="lg"
                          className="min-w-40 bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                          onClick={() => setShowVerifyModal(true)}
                          disabled={actionLoading}
                        >
                          <ShieldCheck className="mr-2 h-4.5 w-4.5" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          className="min-w-40 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-all"
                          onClick={() => setShowRejectModal(true)}
                          disabled={actionLoading}
                        >
                          <ShieldX className="mr-2 h-4.5 w-4.5" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            <Card className="lg:col-span-2 border shadow-sm">
              <CardHeader className="pb-4 border-b bg-gray-50/60">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                  <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
                  Company & Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-7">
                <Info icon={Building2} label="Company" value={recruiter.companyName} />
                <Info icon={FileText} label="Job Posts Used" value={recruiter.jobPostsUsed ?? "—"} />
                <Info
                  icon={CalendarDays}
                  label="Member since"
                  value={new Date(recruiter.joinedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <Info icon={Hash} label="Plan" value={recruiter.subscriptionStatus ?? "—"} />
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-4 border-b bg-gray-50/60">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                  <User className="h-5 w-5 text-indigo-600" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 text-gray-700 leading-relaxed text-[15px]">
                {recruiter.bio?.trim() ? (
                  recruiter.bio
                ) : (
                  <span className="text-gray-400 italic">No company description provided.</span>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ─── Dialogs ─── */}
      <ConfirmDialog
        open={showBlockModal}
        onOpenChange={setShowBlockModal}
        title={recruiter.isActive ? "Suspend Recruiter" : "Restore Recruiter"}
        description={
          recruiter.isActive
            ? "This will immediately block access to the platform. The recruiter will be notified."
            : "This will restore full access. The recruiter will be able to log in again."
        }
        confirmText={recruiter.isActive ? "Suspend" : "Restore"}
        variant={recruiter.isActive ? "destructive" : "default"}
        loading={actionLoading}
        onConfirm={handleToggleStatus}
      />

      <ConfirmDialog
        open={showVerifyModal}
        onOpenChange={setShowVerifyModal}
        title="Approve Verification"
        description="This will mark the recruiter as verified and unlock all platform features."
        confirmText="Approve"
        loading={actionLoading}
        onConfirm={handleVerify}
      />

      <ConfirmDialog
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        title="Reject Verification"
        description="This action cannot be undone. The recruiter will be notified of the rejection."
        confirmText="Reject"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleReject}
      />
    </div>
  );
}



function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex gap-4">
      <div className="rounded-lg bg-gray-100 p-3 h-fit">
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="font-medium text-gray-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  variant = "default",
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  variant?: "default" | "destructive";
  loading: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-4">
          <AlertDialogCancel disabled={loading} className="min-w-25">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "min-w-25",
              variant === "destructive" && "bg-rose-600 hover:bg-rose-700"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}