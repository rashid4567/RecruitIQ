import { ArrowLeft, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CandidateProfile } from "@/module/admin/types/candidate.types"; 

interface CandidateProfileHeaderProps {
  profile: CandidateProfile;
  actionLoading: boolean;
  onRefresh: () => void;
  onBack: () => void;
}

export function CandidateProfileHeader({
  profile,
  actionLoading,
  onRefresh,
  onBack,
}: CandidateProfileHeaderProps) {
  const isBlocked = profile.status === "Blocked";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 select-none">
            <span
              onClick={onBack}
              className="cursor-pointer hover:text-indigo-600 transition-colors"
            >
              Candidates
            </span>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate max-w-45">
              {profile.name}
            </span>
          </div>
        </div>

        <p className="sm:hidden text-base font-semibold text-gray-900 truncate max-w-40">
          {profile.name}
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-0 ${
              isBlocked
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isBlocked ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            {isBlocked ? "Blocked" : "Active"}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={actionLoading}
            className="rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            title="Refresh profile"
          >
            <RefreshCw
              className={`w-4 h-4 ${actionLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
