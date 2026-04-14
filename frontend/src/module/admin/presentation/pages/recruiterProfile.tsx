// pages/admin/recruiters/RecruiterProfilePage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";

import { useRecruiterProfile } from "../hooks/useRecruiterProfile";
import { RecruiterProfileHeader } from "../components/recruiter-profile/RecruiterProfileHeader";
import { RecruiterContactInfo } from "../components/recruiter-profile/RecruiterContactInfo";
import { RecruiterCompanyCard } from "../components/recruiter-profile/RecruiterCompanyCard";
import { RecruiterBioCard } from "../components/recruiter-profile/RecruiterBioCard";
import { RecruiterConfirmModal } from "../components/recruiter-profile/RecruiterConfirmModal";
import { Button } from "@/components/ui/button";

type ConfirmVariant = "default" | "destructive";

interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  variant: ConfirmVariant;
  onConfirm: () => void;
}

const CONFIRM_CLOSED: ConfirmState = {
  open: false,
  title: "",
  description: "",
  confirmText: "",
  variant: "default",
  onConfirm: () => {},
};

export default function RecruiterProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    recruiter,
    loading,
    error,
    actionLoading,
    refetch,
    verifyRecruiter,
    rejectRecruiter,
    toggleActiveStatus,
  } = useRecruiterProfile(id);

  const [confirm, setConfirm] = useState<ConfirmState>(CONFIRM_CLOSED);

  const openConfirm = (
    title: string,
    description: string,
    confirmText: string,
    variant: ConfirmVariant,
    callback: () => void
  ) => setConfirm({ open: true, title, description, confirmText, variant, onConfirm: callback });

  const closeConfirm = () => setConfirm(CONFIRM_CLOSED);

  const handleVerify = () =>
    openConfirm(
      "Approve Verification",
      "This will mark the recruiter as verified and unlock full platform features.",
      "Approve",
      "default",
      verifyRecruiter
    );

  const handleReject = () =>
    openConfirm(
      "Reject Verification",
      "This action cannot be undone. The recruiter will be notified.",
      "Reject",
      "destructive",
      rejectRecruiter
    );

  const handleToggleActive = () => {
    if (!recruiter) return;
    const isActive = recruiter.isActive;
    openConfirm(
      isActive ? "Suspend Recruiter" : "Restore Recruiter",
      isActive
        ? "This will immediately suspend the account and revoke access."
        : "This will restore full access to the platform.",
      isActive ? "Suspend" : "Restore",
      isActive ? "destructive" : "default",
      toggleActiveStatus
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error || !recruiter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <AlertCircle className="h-10 w-10 text-rose-400" />
        <p className="text-slate-600 text-sm max-w-xs text-center">
          {error ?? "Recruiter not found."}
        </p>
        <Button variant="outline" size="sm" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

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

          {/* Col-spans live here, NOT inside the card components */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <RecruiterCompanyCard recruiter={recruiter} />
            </div>
            <div className="lg:col-span-2">
              <RecruiterBioCard recruiter={recruiter} />
            </div>
          </div>

        </div>
      </main>

      <RecruiterConfirmModal
        open={confirm.open}
        onClose={closeConfirm}
        title={confirm.title}
        description={confirm.description}
        confirmText={confirm.confirmText}
        variant={confirm.variant}
        onConfirm={confirm.onConfirm}
        loading={actionLoading}
      />
    </div>
  );
}