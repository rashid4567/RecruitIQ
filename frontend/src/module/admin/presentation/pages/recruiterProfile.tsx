"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MapPin,
  CalendarDays,
  Building2,
  Globe,
  FileText,
  BriefcaseBusiness,
  User,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  Download,
} from "lucide-react";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type { Recruiter } from "../../domain/entities/recruiter.entity";
import {
  getRecruiterProfileUC,
  verifyRecruiterUC,
  rejectRecruiterUC,
} from "../di/recruiter.di";
import { blockUserUC, unblockUserUC } from "../di/user.di";

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: any }
> = {
  pending:  { label: "Pending",   bg: "bg-amber-100",   text: "text-amber-800",   icon: Clock },
  verified: { label: "Verified",  bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2 },
  rejected: { label: "Rejected",  bg: "bg-rose-100",    text: "text-rose-800",    icon: XCircle },
};

export default function RecruiterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: "default" | "destructive";
    onConfirm: () => Promise<void>;
  }>({
    open: false,
    title: "",
    description: "",
    confirmText: "",
    variant: "default",
    onConfirm: async () => {},
  });

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRecruiterProfileUC.execute(id);
        if (mounted) setRecruiter(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load recruiter profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  // ─── Action Handlers ────────────────────────────────────────

  const confirmAction = (
    title: string,
    description: string,
    confirmText: string,
    variant: "default" | "destructive",
    callback: () => Promise<void>
  ) => {
    setConfirm({
      open: true,
      title,
      description,
      confirmText,
      variant,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await callback();
        } catch (err: any) {
          toast.error(err?.message || "Operation failed");
        } finally {
          setActionLoading(false);
          setConfirm(prev => ({ ...prev, open: false }));
        }
      },
    });
  };

  const toggleActive = () => {
    if (!recruiter) return;

    const isActive = recruiter.isActive;

    confirmAction(
      isActive ? "Suspend Recruiter" : "Restore Recruiter",
      isActive
        ? "This will immediately suspend the account and revoke access. The recruiter will be notified."
        : "This will restore full access to the platform. The recruiter will be notified.",
      isActive ? "Suspend" : "Restore",
      isActive ? "destructive" : "default",
      async () => {
        if (isActive) {
          await blockUserUC.execute(recruiter.id);
          setRecruiter(r => r && r.withActiveStatus(false));
          toast.success("Recruiter suspended");
        } else {
          await unblockUserUC.execute(recruiter.id);
          setRecruiter(r => r && r.withActiveStatus(true));
          toast.success("Recruiter restored");
        }
      }
    );
  };

  const verify = () => {
    if (!recruiter) return;

    confirmAction(
      "Approve Verification",
      "This will mark the recruiter as verified and unlock full platform features.",
      "Approve",
      "default",
      async () => {
        await verifyRecruiterUC.execute(recruiter.id);
        setRecruiter(r => r && r.withVerificationStatus("verified"));
        toast.success("Recruiter verified successfully");
      }
    );
  };

  const reject = () => {
    if (!recruiter) return;

    confirmAction(
      "Reject Verification",
      "This action cannot be undone. The recruiter will be notified and may resubmit later.",
      "Reject",
      "destructive",
      async () => {
        await rejectRecruiterUC.execute(recruiter.id);
        setRecruiter(r => r && r.withVerificationStatus("rejected"));
        toast.success("Verification request rejected");
      }
    );
  };

  // ─── Helpers ────────────────────────────────────────────────

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const formatDate = (date?: string | Date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ─── Render States ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8 space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !recruiter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full shadow-sm border-slate-200/70">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {error ? "Error Loading Profile" : "Recruiter Not Found"}
              </h2>
              <p className="text-slate-600 mb-6">
                {error || "The requested recruiter profile could not be found."}
              </p>
              <Button variant="outline" onClick={() => navigate("/admin/recruiters")}>
                Back to Recruiters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { label: vLabel, bg: vBg, text: vText, icon: VIcon } =
    statusConfig[recruiter.verificationStatus] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
                onClick={() => navigate("/admin/recruiters")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Recruiter Profile
              </h1>
            </div>

            <Button variant="outline" size="sm" className="gap-2 shadow-sm">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </header>

          {/* Main Profile Card */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 lg:p-10">
              <div className="grid lg:grid-cols-12 gap-10">
                {/* Avatar + Name + Status */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 ring-2 ring-white shadow-xl transition-transform group-hover:scale-105">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-4xl font-bold">
                        {getInitials(recruiter.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={cn(
                        "absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center",
                        recruiter.isActive ? "bg-emerald-500" : "bg-rose-500"
                      )}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      {recruiter.name}
                    </h2>
                    <p className="text-lg text-slate-600 mt-1 font-medium">
                      {recruiter.companyName || "—"}
                    </p>
                  </div>

                  <Badge
                    className={cn(
                      "px-5 py-2 text-base font-medium flex items-center gap-2 shadow-sm",
                      vBg,
                      vText
                    )}
                  >
                    <VIcon className="h-5 w-5" />
                    {vLabel}
                  </Badge>
                </div>

                {/* Contact Info + Actions */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <InfoItem icon={Mail}        label="Email"     value={recruiter.email} />
                    {recruiter.location && (
                      <InfoItem icon={MapPin}    label="Location"  value={recruiter.location} />
                    )}
                   
                    <InfoItem
                      icon={CalendarDays}
                      label="Joined"
                      value={formatDate(recruiter.joinedDate)}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="flex flex-wrap gap-3">
                    {recruiter.verificationStatus === "pending" && (
                      <>
                        <Button
                          className="h-10 bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2 min-w-[140px]"
                          disabled={actionLoading}
                          onClick={verify}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Verify
                        </Button>

                        <Button
                          variant="outline"
                          className="h-10 border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800 shadow-sm gap-2 min-w-[140px]"
                          disabled={actionLoading}
                          onClick={reject}
                        >
                          <ShieldX className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    <Button
                      variant={recruiter.isActive ? "outline" : "default"}
                      className={cn(
                        "h-10 shadow-sm gap-2 min-w-[140px]",
                        recruiter.isActive
                          ? "border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      )}
                      disabled={actionLoading}
                      onClick={toggleActive}
                    >
                      {recruiter.isActive ? (
                        <>
                          <UserX className="h-4 w-4" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Restore
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Info Section */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Company & Stats */}
            <Card className="lg:col-span-2 border-slate-200/60 shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/80 px-6 py-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
                  Company & Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
                <InfoItem icon={Building2}      label="Company"          value={recruiter.companyName} />
                <InfoItem icon={FileText}       label="Job Posts Used"   value={recruiter.jobPostsUsed ?? "—"} />
                <InfoItem icon={CalendarDays}   label="Member Since"     value={formatDate(recruiter.joinedDate)} />
                
              </CardContent>
            </Card>

            {/* Bio */}
            <Card className="border-slate-200/60 shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/80 px-6 py-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  About Company
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-slate-700 text-[15px] leading-relaxed">
                {recruiter.bio?.trim() ? (
                  recruiter.bio
                ) : (
                  <span className="text-slate-500 italic">No company description provided.</span>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ─── Unified Confirmation Dialog ─── */}
      <AlertDialog open={confirm.open} onOpenChange={v => setConfirm(prev => ({ ...prev, open: v }))}>
        <AlertDialogContent className="max-w-md rounded-2xl shadow-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-900">
              {confirm.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600 leading-relaxed">
              {confirm.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel
              className="h-10 rounded-md border-slate-300 hover:bg-slate-50"
              disabled={actionLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirm.onConfirm}
              disabled={actionLoading}
              className={cn(
                "h-10 rounded-md min-w-[100px]",
                confirm.variant === "destructive"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirm.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number }) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-slate-100 p-3 shadow-sm">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="mt-1 font-medium text-slate-900 truncate">{value ?? "—"}</p>
      </div>
    </div>
  );
}