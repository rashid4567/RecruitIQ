import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { useRecruiters } from "../hooks/Recruiter-Hooks/useRecruiters";
import { RecruiterManagementHeader } from "./components/recruiterlist/RecruiterManagementHeader";
import { RecruiterFilters } from "./components/recruiterlist/RecruiterFilters";
import { RecruiterTable } from "./components/recruiterlist/RecruiterTable";
import type {
  RecruiterListItem,
  RecruiterProfile,
} from "../types/recruiter.types";
import { useNavigate } from "react-router-dom";
import { CommonConfirmDialog } from "@/shared/Commonconfirmdialog";
import { ImpactList } from "@/shared/ImpactList";
import { ShieldCheck, ShieldOff, Ban, XCircle } from "lucide-react";

type RecruiterAction = "verify" | "reject" | "block" | "unblock";
interface ConfirmState {
  open: boolean;
  recruiter: RecruiterProfile | null;
  action: RecruiterAction | null;
}

export default function RecruiterManagement() {
  const recruitersData = useRecruiters();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState<ConfirmState>({
    open: false,
    recruiter: null,
    action: null,
  });

  const handleViewProfile = (recruiterId: string) => {
    navigate(`/admin/recruiters/${recruiterId}`);
  };

  const dialogConfig = {
    verify: {
      title: "Verify Recruiter",
      description: `Grant verified status and full platform access to ${
        confirm.recruiter?.companyName ??
        confirm.recruiter?.name ??
        "this recruiter"
      }.`,
      icon: <ShieldCheck />,
      variant: "success" as const,
      confirmText: "Verify",
      loadingText: "Verifying...",
      label: "Benefit",
      items: [
        "Recruiter becomes verified",
        "Platform access granted",
        "Can publish and manage jobs",
      ],
    },

    reject: {
      title: "Reject Application",
      description: `Reject the verification request from ${
        confirm.recruiter?.companyName ??
        confirm.recruiter?.name ??
        "this recruiter"
      }.`,
      icon: <XCircle />,
      variant: "danger" as const,
      confirmText: "Reject",
      loadingText: "Rejecting...",
      label: "Impact",
      items: ["Verification request rejected", "Recruiter remains unverified"],
    },

    block: {
      title: "Block Recruiter",
      description: `Immediately revoke platform access for ${
        confirm.recruiter?.companyName ??
        confirm.recruiter?.name ??
        "this recruiter"
      }.`,
      icon: <Ban />,
      variant: "danger" as const,
      confirmText: "Block",
      loadingText: "Blocking...",
      label: "Impact",
      items: [
        "Platform access revoked",
        "Cannot manage jobs",
        "Cannot access candidates",
      ],
    },

    unblock: {
      title: "Unblock Recruiter",
      description: `Restore platform access for ${
        confirm.recruiter?.companyName ??
        confirm.recruiter?.name ??
        "this recruiter"
      }.`,
      icon: <ShieldOff />,
      variant: "success" as const,
      confirmText: "Unblock",
      loadingText: "Restoring...",
      label: "Benefit",
      items: [
        "Platform access restored",
        "Job management enabled",
        "Candidate access restored",
      ],
    },
  };

  const current = confirm.action != null ? dialogConfig[confirm.action] : null;

  const handleAction = (
    recruiter: RecruiterListItem,
    action: RecruiterAction,
  ) => {
    setConfirm({
      open: true,
      recruiter,
      action,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirm.recruiter || !confirm.action) return;
    await recruitersData.performAction(confirm.recruiter, confirm.action);
    setConfirm({ open: false, recruiter: null, action: null });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <RecruiterManagementHeader onRefresh={recruitersData.fetchRecruiters} />

        <RecruiterFilters
          search={recruitersData.search}
          setSearch={recruitersData.setSearch}
          tab={recruitersData.tab}
          setTab={recruitersData.setTab}
        />

        <main className="flex-1 p-6">
          <RecruiterTable
            recruiters={recruitersData.recruiters}
            loading={recruitersData.loading}
            pagination={recruitersData.pagination}
            actionLoading={recruitersData.actionLoading}
            onPageChange={(page) => recruitersData.setPage(page)}
            onAction={handleAction}
            onViewProfile={handleViewProfile}
          />
        </main>

        {current && (
          <CommonConfirmDialog
            open={confirm.open}
            onOpenChange={(open) => {
              if (!open) {
                setConfirm({
                  open: false,
                  recruiter: null,
                  action: null,
                });
              }
            }}
            icon={current.icon}
            title={current.title}
            description={current.description}
            variant={current.variant}
            confirmText={current.confirmText}
            loading={
              confirm.recruiter
                ? (recruitersData.actionLoading[confirm.recruiter.id] ?? false)
                : false
            }
            loadingText={current.loadingText}
            onConfirm={handleConfirmAction}
          >
            <ImpactList
              tone={current.variant}
              label={current.label}
              items={current.items}
            />
          </CommonConfirmDialog>
        )}
      </div>
    </div>
  );
}
