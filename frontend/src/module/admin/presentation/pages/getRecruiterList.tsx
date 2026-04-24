
import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { useRecruiters } from "../hooks/Recruiter-Hooks/useRecruiters";
import { RecruiterManagementHeader } from "../components/recruiterlist/RecruiterManagementHeader";
import { RecruiterFilters } from "../components/recruiterlist/RecruiterFilters";
import { RecruiterTable } from "../components/recruiterlist/RecruiterTable";
import { RecruiterActionDialog } from "../components/recruiterlist/RecruiterActionDialog";
import { useNavigate } from "react-router-dom";

export default function RecruiterManagement() {
  const recruitersData = useRecruiters();
  const navigate = useNavigate();

  const [confirm, setConfirm] = useState<{
    open: boolean;
    recruiter: any;
    action: string | null;
  }>({ open: false, recruiter: null, action: null });

  const handleViewProfile = (recruiterId: string) => {
    navigate(`/admin/recruiters/${recruiterId}`);
  };

  const handleAction = (recruiter: any, action: string) => {
    setConfirm({ open: true, recruiter, action });
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
            error={recruitersData.error}
            pagination={recruitersData.pagination}
            setPagination={recruitersData.setPagination}
            actionLoading={recruitersData.actionLoading}
            onAction={handleAction}
            onViewProfile={handleViewProfile}  
          />
        </main>

        <RecruiterActionDialog
          open={confirm.open}
          recruiter={confirm.recruiter}
          action={confirm.action}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirm({ open: false, recruiter: null, action: null })}
        />
      </div>
    </div>
  );
}