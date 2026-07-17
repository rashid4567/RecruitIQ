import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecruiters } from "../hooks/Recruiter-Hooks/useRecruiters";
import { RecruiterTable } from "./components/recruiterlist/RecruiterTable";
import { RecruiterStatsCards } from "./components/recruiterlist/RecruiterStatsCards";
import type { RecruiterListItem, RecruiterProfile } from "../types/recruiter.types";
import { CommonConfirmDialog } from "@/shared/Commonconfirmdialog";
import { ImpactList } from "@/shared/ImpactList";
import { ManagementHeader } from "@/shared/table/ManagementHeader";
import { SearchFilterBar } from "@/shared/table/SearchFilterBar";
import { ShieldCheck, ShieldOff, Ban, XCircle } from "lucide-react";

type RecruiterAction = "verify" | "reject" | "block" | "unblock";
type FilterTab = "all" | "pending" | "verified" | "blocked";

interface ConfirmState {
  open: boolean;
  recruiter: RecruiterProfile | null;
  action: RecruiterAction | null;
}

const TAB_FILTERS: { label: string; value: FilterTab; activeClassName: string }[] = [
  { label: "All", value: "all", activeClassName: "bg-slate-800 hover:bg-slate-900" },
  { label: "Pending", value: "pending", activeClassName: "bg-amber-600 hover:bg-amber-700" },
  { label: "Verified", value: "verified", activeClassName: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "Blocked", value: "blocked", activeClassName: "bg-rose-600 hover:bg-rose-700" },
];

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

  const recruiterLabel = confirm.recruiter?.companyName ?? confirm.recruiter?.name ?? "this recruiter";

  const dialogConfig = {
    verify: {
      title: "Verify Recruiter",
      description: `Grant verified status and full platform access to ${recruiterLabel}.`,
      icon: <ShieldCheck />,
      variant: "success" as const,
      confirmText: "Verify",
      loadingText: "Verifying...",
      label: "Benefit",
      items: ["Recruiter becomes verified", "Platform access granted", "Can publish and manage jobs"],
    },
    reject: {
      title: "Reject Application",
      description: `Reject the verification request from ${recruiterLabel}.`,
      icon: <XCircle />,
      variant: "danger" as const,
      confirmText: "Reject",
      loadingText: "Rejecting...",
      label: "Impact",
      items: ["Verification request rejected", "Recruiter remains unverified"],
    },
    block: {
      title: "Block Recruiter",
      description: `Immediately revoke platform access for ${recruiterLabel}.`,
      icon: <Ban />,
      variant: "danger" as const,
      confirmText: "Block",
      loadingText: "Blocking...",
      label: "Impact",
      items: ["Platform access revoked", "Cannot manage jobs", "Cannot access candidates"],
    },
    unblock: {
      title: "Unblock Recruiter",
      description: `Restore platform access for ${recruiterLabel}.`,
      icon: <ShieldOff />,
      variant: "success" as const,
      confirmText: "Unblock",
      loadingText: "Restoring...",
      label: "Benefit",
      items: ["Platform access restored", "Job management enabled", "Candidate access restored"],
    },
  };

  const current = confirm.action != null ? dialogConfig[confirm.action] : null;

  const handleAction = (recruiter: RecruiterListItem, action: RecruiterAction) => {
    setConfirm({ open: true, recruiter, action });
  };

  const handleConfirmAction = async () => {
    if (!confirm.recruiter || !confirm.action) return;
    await recruitersData.performAction(confirm.recruiter, confirm.action);
    setConfirm({ open: false, recruiter: null, action: null });
  };

  return (
    <div className="min-h-full bg-linear-to-br from-slate-50 to-indigo-50/30 flex">
      <div className="flex-1 flex flex-col">
        <ManagementHeader
          title="Recruiter Management"
          description="Review, verify and manage all recruiters"
          onRefresh={recruitersData.fetchRecruiters}
          loading={recruitersData.loading}
        />

        <SearchFilterBar
          searchTerm={recruitersData.search}
          onSearchChange={recruitersData.setSearch}
          searchPlaceholder="Search by name, email or company..."
          filters={TAB_FILTERS}
          activeFilter={recruitersData.tab}
          onFilterChange={recruitersData.setTab}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
          <div className="max-w-none">
            <RecruiterStatsCards
              recruiters={recruitersData.recruiters}
              total={recruitersData.pagination.total}
              activeFilter={recruitersData.tab}
              onFilterClick={(value) => recruitersData.setTab(value)}
            />

            <RecruiterTable
              recruiters={recruitersData.recruiters}
              loading={recruitersData.loading}
              pagination={recruitersData.pagination}
              actionLoading={recruitersData.actionLoading}
              onPageChange={(page) => recruitersData.setPage(page)}
              onAction={handleAction}
              onViewProfile={handleViewProfile}
            />
          </div>
        </main>

        {current && (
          <CommonConfirmDialog
            open={confirm.open}
            onOpenChange={(open) => {
              if (!open) {
                setConfirm({ open: false, recruiter: null, action: null });
              }
            }}
            icon={current.icon}
            title={current.title}
            description={
              <>
                {confirm.recruiter && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 mb-3 text-sm">
                    <div className="font-medium text-slate-800">
                      {confirm.recruiter.companyName || confirm.recruiter.name}
                    </div>
                    {confirm.recruiter.companyName && confirm.recruiter.name && (
                      <div className="text-slate-600">{confirm.recruiter.name}</div>
                    )}
                    <div className="text-slate-500">{confirm.recruiter.email}</div>
                  </div>
                )}
                {current.description}
              </>
            }
            variant={current.variant}
            confirmText={current.confirmText}
            loading={confirm.recruiter ? (recruitersData.actionLoading[confirm.recruiter.id] ?? false) : false}
            loadingText={current.loadingText}
            onConfirm={handleConfirmAction}
          >
            <ImpactList tone={current.variant} label={current.label} items={current.items} />
          </CommonConfirmDialog>
        )}
      </div>
    </div>
  );
}