import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCandidateProfile } from "../hooks/Candidate-Hooks/useCandidateProfile";
import { toast } from "sonner";
import { CandidateProfileHeader } from "../components/candidate-profile/CandidateProfileHeader";
import { CandidateProfileContent } from "../components/candidate-profile/CandidateProfileContent";
import { CandidateProfileDialogs } from "../components/candidate-profile/CandidateProfileDialogs";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const CandidateProfileView: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  const { profile, loading, error, actionLoading, refresh, block, unblock } =
    useCandidateProfile(candidateId);

  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);

  const handleBlockCandidate = async () => {
    try {
      await block();

      toast.success("Candidate blocked", {
        description: `${profile?.name} can no longer access the platform.`,
        icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      });

      setBlockDialogOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to block candidate";

      toast.error(message);
    }
  };

  const handleUnblockCandidate = async () => {
    try {
      await unblock();

      toast.success("Candidate unblocked", {
        description: `${profile?.name} can now access the platform.`,
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      });

      setUnblockDialogOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to unblock candidate";

      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-pulse" />
              <div className="absolute inset-2 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent" />
            </div>
            <p className="text-lg font-medium text-indigo-700">
              Loading candidate profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-lg border-none shadow-2xl bg-white/80 backdrop-blur-lg rounded-3xl">
            <CardContent className="p-10 text-center space-y-6">
              <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">
                {error ? "Failed to Load Profile" : "Profile Not Found"}
              </h2>
              <p className="text-gray-600">
                {error ||
                  "The candidate profile could not be found or may have been removed."}
              </p>
              <Button
                onClick={() =>
                  error ? refresh() : navigate("/admin/candidates")
                }
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
              >
                {error ? "Try Again" : "Back to Candidates"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CandidateProfileHeader
          profile={profile}
          actionLoading={actionLoading}
          onRefresh={refresh}
          onBack={() => navigate("/admin/candidates")}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <CandidateProfileContent
            profile={profile}
            onBlockClick={() => setBlockDialogOpen(true)}
            onUnblockClick={() => setUnblockDialogOpen(true)}
            actionLoading={actionLoading}
          />
        </main>
      </div>

      <CandidateProfileDialogs
        profile={profile}
        blockDialogOpen={blockDialogOpen}
        unblockDialogOpen={unblockDialogOpen}
        actionLoading={actionLoading}
        onBlockDialogChange={setBlockDialogOpen}
        onUnblockDialogChange={setUnblockDialogOpen}
        onBlockConfirm={handleBlockCandidate}
        onUnblockConfirm={handleUnblockCandidate}
      />
    </div>
  );
};

export default CandidateProfileView;
