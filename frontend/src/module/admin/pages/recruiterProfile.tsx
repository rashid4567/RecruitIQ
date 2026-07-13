import { useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldOff,
  Ban,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";

import { useRecruiterProfile } from "../hooks/Recruiter-Hooks/useRecruiterProfile";
import { useUserStatus } from "../hooks/Candidate-Hooks/useUserStatus";

import { RecruiterProfileHeader } from "./components/recruiter-profile/RecruiterProfileHeader";
import { RecruiterContactInfo } from "./components/recruiter-profile/RecruiterContactInfo";
import { RecruiterCompanyCard } from "./components/recruiter-profile/RecruiterCompanyCard";
import { RecruiterBioCard } from "./components/recruiter-profile/RecruiterBioCard";
import { Button } from "@/components/ui/button";

import { CommonConfirmDialog } from "@/shared/Commonconfirmdialog";
import { ImpactList } from "@/shared/ImpactList";

type RecruiterProfileAction = "verify" | "reject" | "block" | "unblock" | null;

export default function RecruiterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { recruiter, loading, error, actionLoading, refresh, verify, reject } =
    useRecruiterProfile(id);

  const { toggleUserStatus } = useUserStatus({ onSuccess: refresh });

  const [confirmAction, setConfirmAction] =
    useState<RecruiterProfileAction>(null);

  const closeDialog = () => setConfirmAction(null);

  const handleVerify = () => setConfirmAction("verify");
  const handleReject = () => setConfirmAction("reject");
  const handleToggleActive = () => {
    if (!recruiter) return;
    setConfirmAction(recruiter.isActive ? "block" : "unblock");
  };

  const dialogConfig = {
    verify: {
      title: "Approve Verification",
      description:
        "This will mark the recruiter as verified and unlock full platform features.",
      icon: <ShieldCheck />,
      variant: "success" as const,
      confirmText: "Approve",
      loadingText: "Approving...",
      label: "Benefit",
      items: [
        "Recruiter becomes verified",
        "Platform access unlocked",
        "Can publish jobs",
      ],
      onConfirm: verify,
    },

    reject: {
      title: "Reject Verification",
      description:
        "This action cannot be undone. The recruiter will be notified.",
      icon: <XCircle />,
      variant: "danger" as const,
      confirmText: "Reject",
      loadingText: "Rejecting...",
      label: "Impact",
      items: ["Verification request rejected", "Recruiter remains unverified"],
      onConfirm: reject,
    },

    block: {
      title: "Suspend Recruiter",
      description:
        "This will immediately suspend the account and revoke access.",
      icon: <Ban />,
      variant: "danger" as const,
      confirmText: "Suspend",
      loadingText: "Suspending...",
      label: "Impact",
      items: [
        "Platform access revoked",
        "Cannot manage jobs",
        "Cannot access dashboard",
      ],
      onConfirm: () => {
        if (!recruiter) return;
        return toggleUserStatus(recruiter.id, true);
      },
    },

    unblock: {
      title: "Restore Recruiter",
      description: "This will restore full access to the platform.",
      icon: <ShieldOff />,
      variant: "success" as const,
      confirmText: "Restore",
      loadingText: "Restoring...",
      label: "Benefit",
      items: [
        "Platform access restored",
        "Dashboard enabled",
        "Job management restored",
      ],
      onConfirm: () => {
        if (!recruiter) return;
        return toggleUserStatus(recruiter.id, false);
      },
    },
  } as const;

  const current = confirmAction != null ? dialogConfig[confirmAction] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-gray-400 mx-auto" />
          <p className="text-sm text-gray-400 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error || !recruiter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900">
              Recruiter not found
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              {error ?? "Unable to load recruiter information."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
        <div className="hidden lg:block">
        <Sidebar />
    </div>


      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">
                RecruitIQ
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Admin · Recruiter Profile
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
          <RecruiterProfileHeader
            recruiter={recruiter}
            onBack={() => navigate("/admin/recruiters")}
          />

          <RecruiterContactInfo
            recruiter={recruiter}
            onVerify={handleVerify}
            onReject={handleReject}
            onToggleActive={handleToggleActive}
            actionLoading={actionLoading}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecruiterCompanyCard recruiter={recruiter} />
            </div>
            <div className="lg:col-span-2">
              <RecruiterBioCard recruiter={recruiter} />
            </div>
          </div>
        </div>
      </main>

      {current && (
        <CommonConfirmDialog
          open={confirmAction !== null}
          onOpenChange={(open) => {
            if (!open) closeDialog();
          }}
          icon={current.icon}
          title={current.title}
          description={current.description}
          variant={current.variant}
          confirmText={current.confirmText}
          loading={actionLoading}
          loadingText={current.loadingText}
          onConfirm={async () => {
            await current.onConfirm();
            closeDialog();
          }}
        >
          <ImpactList
            tone={current.variant}
            label={current.label}
            items={current.items}
          />
        </CommonConfirmDialog>
      )}
    </div>
  );
}
