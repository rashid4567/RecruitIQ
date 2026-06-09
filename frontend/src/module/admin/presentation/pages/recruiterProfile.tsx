import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";

import { useRecruiterProfile } from "../hooks/Recruiter-Hooks/useRecruiterProfile";
import { useUserStatus } from "../hooks/Candidate-Hooks/useUserStatus";

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
  } = useRecruiterProfile(id);

  const { toggleUserStatus } = useUserStatus({ onSuccess: refetch });

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
      () => toggleUserStatus(recruiter.id, isActive)
    );
  };

  // ── Loading ──────────────────────────────────────────────────────────────
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

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !recruiter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900">Recruiter not found</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              {error ?? "Unable to load recruiter information."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">

        {/* ── Top Navbar ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">RecruitIQ</h1>
              <p className="text-xs text-gray-400 mt-0.5">Admin · Recruiter Profile</p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

          {/* ── Profile Header ─────────────────────────────────────────── */}
          <RecruiterProfileHeader
            recruiter={recruiter}
            onBack={() => navigate("/admin/recruiters")}
          />

          {/* ── Contact / Action Bar ───────────────────────────────────── */}
          <RecruiterContactInfo
            recruiter={recruiter}
            onVerify={handleVerify}
            onReject={handleReject}
            onToggleActive={handleToggleActive}
            actionLoading={actionLoading}
          />

          {/* ── Company + Bio ──────────────────────────────────────────── */}
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