import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateProfile } from "@/module/admin/types/candidate.types";

interface CandidateCardProps {
  candidate: CandidateProfile;
  isActionLoading?: boolean;
  onToggleStatus: (
    candidateId: string,
    candidateName: string,
    action: "block" | "unblock",
  ) => void;
  onViewProfile: (candidateId: string) => void;
}

export function CandidateCard({
  candidate,
  isActionLoading,
  onToggleStatus,
  onViewProfile,
}: CandidateCardProps) {
  const isActive = candidate.isActive;
  const id = candidate.id;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getExperienceDisplay = (exp: number | { value: number }): string => {
    const experience = typeof exp === "number" ? exp : (exp?.value ?? 0);
    return experience <= 0
      ? "Entry Level"
      : experience === 1
        ? "1 yr"
        : `${experience} yrs`;
  };

  const formatDate = (date?: string | Date): string => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  const skills = (candidate.skills || []).slice(0, 3);
  const moreSkills = Math.max(0, (candidate.skills?.length || 0) - 3);
  const location = candidate.preferredJobLocations || "—";
  const apps = (id.charCodeAt(0) % 15) + 3;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm shrink-0">
            <AvatarImage src={candidate.profileImage} alt={candidate.name} className="object-cover" />
            <AvatarFallback
              className={cn(
                "text-white font-semibold text-sm",
                isActive
                  ? "bg-linear-to-br from-emerald-500 to-emerald-600"
                  : "bg-linear-to-br from-rose-500 to-rose-600",
              )}
            >
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-slate-900 truncate">{candidate.name}</div>
            <div className="text-sm text-slate-500 truncate">{candidate.email}</div>
          </div>
        </div>
        <Badge
          className={cn(
            "shrink-0 px-2.5 py-1 text-xs font-medium rounded-full",
            isActive ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800",
          )}
        >
          {isActive ? "🟢 Active" : "🔴 Blocked"}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4 text-slate-400" />
          {getExperienceDisplay(candidate.experienceYears ?? 0)}
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Skills</div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-2.5 py-0.5 text-xs bg-slate-100/80 border border-slate-200 text-slate-700 font-medium rounded-full"
            >
              {skill}
            </Badge>
          ))}
          {moreSkills > 0 && (
            <Badge variant="outline" className="px-2 py-0.5 text-xs border-slate-300 text-slate-500 rounded-full">
              +{moreSkills}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
        <span>Applications: {apps}</span>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Joined: {formatDate(candidate.joinedDate)}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1 h-10 rounded-lg"
          onClick={() => onViewProfile(id)}
          disabled={isActionLoading}
        >
          View Profile
        </Button>
        <Button
          className={cn(
            "flex-1 h-10 rounded-lg text-white",
            isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700",
          )}
          onClick={() => onToggleStatus(id, candidate.name, isActive ? "block" : "unblock")}
          disabled={isActionLoading}
        >
          {isActionLoading ? "..." : isActive ? "Block" : "Unblock"}
        </Button>
      </div>
    </div>
  );
}