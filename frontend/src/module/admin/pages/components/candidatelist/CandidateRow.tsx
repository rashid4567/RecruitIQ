import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateProfile } from "@/module/admin/types/candidate.types";

interface CandidateRowProps {
  candidate: CandidateProfile;
  isActionLoading?: boolean;
  onToggleStatus: (
    candidateId: string,
    candidateName: string,
    action: "block" | "unblock",
  ) => void;
  onViewProfile: (candidateId: string) => void;
}

export function CandidateRow({
  candidate,
  isActionLoading,
  onToggleStatus,
  onViewProfile,
}: CandidateRowProps) {
  const isActive = candidate.isActive;
  const id = candidate.id;

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
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSkills = (candidate: CandidateProfile): string[] => {
    return (candidate.skills || []).slice(0, 3);
  };

  const getMoreSkillsCount = (candidate: CandidateProfile): number => {
    return Math.max(0, (candidate.skills?.length || 0) - 3);
  };

  const getLocation = (candidate: CandidateProfile): string =>
    (candidate.preferredJobLocations as unknown as string) || "—";

  return (
    <tr className="hover:bg-indigo-50/30 transition-colors duration-200 group">
      <td className="pl-2 pr-4 md:pl-3 md:pr-5 lg:pl-4 lg:pr-6 py-4 lg:py-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-white shadow-sm shrink-0">
            <AvatarImage
              src={candidate.profileImage}
              alt={candidate.name}
              className="object-cover"
            />
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
            <div className="font-medium text-slate-900 truncate max-w-36 sm:max-w-48 lg:max-w-60">
              {candidate.name}
            </div>
            <div className="text-sm text-slate-500 mt-0.5 truncate max-w-36 sm:max-w-48 lg:max-w-60">
              {candidate.email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 md:px-5 py-4 lg:py-5">
        <div className="flex flex-wrap gap-1.5 max-w-52">
          {getSkills(candidate).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-2.5 py-0.5 text-xs bg-slate-100/80 border border-slate-200 text-slate-700 font-medium rounded-full whitespace-nowrap"
            >
              {skill}
            </Badge>
          ))}
          {getMoreSkillsCount(candidate) > 0 && (
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-xs border-slate-300 text-slate-500 rounded-full whitespace-nowrap"
            >
              +{getMoreSkillsCount(candidate)}
            </Badge>
          )}
        </div>
      </td>

      <td className="hidden lg:table-cell px-5 py-5 text-slate-700 text-sm whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
          {getExperienceDisplay(candidate.experienceYears ?? 0)}
        </div>
      </td>

      <td className="hidden lg:table-cell px-5 py-5 text-slate-600 text-sm">
        <div className="flex items-center gap-2 max-w-48">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="truncate">{getLocation(candidate)}</span>
        </div>
      </td>

      <td className="hidden xl:table-cell px-4 py-5 text-center whitespace-nowrap">
        <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm">
          {(id.charCodeAt(0) % 15) + 3}
        </Badge>
      </td>

      <td className="px-4 py-4 lg:py-5 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-white shrink-0",
              isActive
                ? "bg-emerald-500 ring-emerald-300/50"
                : "bg-rose-500 ring-rose-300/50",
            )}
          />
          <Badge
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap",
              isActive
                ? "bg-emerald-50 text-emerald-800"
                : "bg-rose-50 text-rose-800",
            )}
          >
            {isActive ? "Active" : "Blocked"}
          </Badge>
          <label
            className={cn(
              "hidden lg:inline-flex relative h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2",
              isActive ? "bg-emerald-500" : "bg-rose-500",
              isActionLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={isActive}
              onChange={() =>
                onToggleStatus(
                  id,
                  candidate.name,
                  isActive ? "block" : "unblock",
                )
              }
              disabled={isActionLoading}
            />
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-black/5 transition duration-200 ease-in-out",
                isActive ? "translate-x-5" : "translate-x-1",
              )}
            />
          </label>
        </div>
      </td>

      <td className="hidden xl:table-cell px-5 py-5 text-slate-600 text-sm whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
          {formatDate(candidate.joinedDate)}
        </div>
      </td>

      <td className="px-4 md:px-6 py-4 lg:py-5 text-right md:pr-8 whitespace-nowrap">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors"
          onClick={() => onViewProfile(id)}
          disabled={isActionLoading}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}