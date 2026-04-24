import {
  ChevronLeft,
  Download,
  Users,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Candidate } from "../../../domain/entities/candidates.entity";

interface CandidateProfileHeaderProps {
  profile: Candidate;
  actionLoading: boolean;
  onRefresh: () => void;
  onBack: () => void;
}

export function CandidateProfileHeader({
  profile,
  onRefresh,
  onBack,
}: CandidateProfileHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 px-4 sm:px-8 py-5 sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-indigo-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-7 h-7 text-indigo-600" />
              Candidate Profile
            </h1>
            <p className="text-sm text-gray-600 mt-1">{profile.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            CV
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <Zap className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
}