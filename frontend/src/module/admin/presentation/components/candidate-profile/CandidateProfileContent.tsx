import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Code,
  Award,
  CheckCircle2,
  Ban,
  GraduationCap,
  Linkedin,
  ShieldX,
  ShieldCheck,
  Calendar,
  Clock,
  ThumbsUp,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
  Star,
  TrendingUp,
} from "lucide-react";
import { Candidate } from "../../../domain/entities/candidates.entity";

function getExperienceDisplay(years: number): string {
  if (years <= 0) return "Entry Level";
  if (years === 1) return "1 year";
  return `${years} years`;
}

function getExperienceLevel(years: number): { label: string; dot: string; pill: string } {
  if (years <= 2) return { label: "Junior", dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" };
  if (years <= 5) return { label: "Mid-Level", dot: "bg-sky-400", pill: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" };
  if (years <= 8) return { label: "Senior", dot: "bg-violet-400", pill: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" };
  return { label: "Expert", dot: "bg-amber-400", pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" };
}

function getInitials(name?: string) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "NA"
  );
}


function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 text-gray-500 text-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex-1 min-w-[130px] bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow duration-200">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
        <div className="text-sm font-semibold text-gray-800 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

interface CandidateProfileContentProps {
  profile: Candidate;
  onBlockClick?: () => void;
  onUnblockClick?: () => void;
  actionLoading?: boolean;
}

export function CandidateProfileContent({
  profile,
  onBlockClick,
  onUnblockClick,
  actionLoading = false,
}: CandidateProfileContentProps) {
  const isBlocked = profile.status === "Blocked";
  const experienceLevel = getExperienceLevel(profile.experienceYears);

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans p-4 sm:p-8 space-y-6">

      {/* ── Hero Card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Top bar stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-slate-300 via-gray-200 to-slate-300" />

        <div className="px-6 sm:px-10 py-8">
          <div className="flex flex-col sm:flex-row items-start gap-7">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="rounded-2xl overflow-hidden ring-4 ring-gray-50 shadow-lg w-24 h-24 sm:w-28 sm:h-28">
                <Avatar className="w-full h-full rounded-2xl">
                  <AvatarImage src={profile.profileImage} alt={profile.name} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Status dot */}
              <span
                className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white shadow-sm ${isBlocked ? "bg-red-400" : "bg-emerald-400"}`}
              />
            </div>

            {/* Identity */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${experienceLevel.pill}`}>
                  {experienceLevel.label}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    isBlocked
                      ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                      : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                  }`}
                >
                  {isBlocked ? (
                    <Ban className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                  {isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              {profile.currentJob && (
                <p className="text-base text-gray-500 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                  {profile.currentJob}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {profile.currentJobLocation && (
                  <MetaChip icon={<MapPin className="w-3.5 h-3.5" />} label={profile.currentJobLocation} />
                )}
                <MetaChip icon={<Mail className="w-3.5 h-3.5" />} label={profile.email} />
                <MetaChip icon={<Clock className="w-3.5 h-3.5" />} label="Open to opportunities" />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              {profile.linkedinUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 gap-2"
                >
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
              )}

              {isBlocked ? (
                <Button
                  onClick={onUnblockClick}
                  size="sm"
                  disabled={actionLoading}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Unblock
                </Button>
              ) : (
                <Button
                  onClick={onBlockClick}
                  size="sm"
                  variant="outline"
                  disabled={actionLoading}
                  className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 gap-2"
                >
                  <ShieldX className="w-4 h-4" />
                  Block
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="border-t border-gray-50 px-6 sm:px-10 py-5">
          <div className="flex flex-wrap gap-4">
            <StatCard
              icon={<Award className="w-4 h-4 text-amber-600" />}
              accent="bg-amber-50"
              label="Experience"
              value={getExperienceDisplay(profile.experienceYears)}
            />
            {profile.educationLevel && (
              <StatCard
                icon={<GraduationCap className="w-4 h-4 text-violet-600" />}
                accent="bg-violet-50"
                label="Education"
                value={profile.educationLevel}
              />
            )}
            {profile.skills.length > 0 && (
              <StatCard
                icon={<Code className="w-4 h-4 text-sky-600" />}
                accent="bg-sky-50"
                label="Skills"
                value={`${profile.skills.length} listed`}
              />
            )}
            <StatCard
              icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
              accent="bg-emerald-50"
              label="Match Score"
              value={
                <span className="text-emerald-600 font-bold">98%</span>
              }
            />
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {profile.bio && (
            <SectionCard
              icon={<FileText className="w-4 h-4 text-slate-600" />}
              accent="bg-slate-100"
              title="About"
            >
              <p className="text-gray-600 leading-relaxed text-sm">
                {profile.bio}
              </p>
            </SectionCard>
          )}

          {profile.skills.length > 0 && (
            <SectionCard
              icon={<Code className="w-4 h-4 text-sky-600" />}
              accent="bg-sky-50"
              title="Technical Skills"
            >
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 text-gray-700 text-sm rounded-xl transition-colors cursor-default font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {profile.skills.length >= 3 && (
                <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">
                    <span className="font-semibold">Top demand: </span>
                    {profile.skills.slice(0, 3).join(", ")} are trending this year.
                  </p>
                </div>
              )}
            </SectionCard>
          )}

          {profile.preferredJobLocations?.length > 0 && (
            <SectionCard
              icon={<MapPin className="w-4 h-4 text-rose-500" />}
              accent="bg-rose-50"
              title="Preferred Locations"
            >
              <div className="flex flex-wrap gap-2">
                {profile.preferredJobLocations.map((loc, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-sm rounded-xl font-medium flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {loc}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Experience card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Experience</h3>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900 tabular-nums">
                {profile.experienceYears > 0 ? profile.experienceYears : "—"}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                {profile.experienceYears === 1 ? "year" : profile.experienceYears > 1 ? "years total" : "Entry level"}
              </p>
            </div>
            {profile.currentJob && (
              <div className="pt-4 border-t border-gray-50 space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Current Role</p>
                <p className="text-sm font-semibold text-gray-800">{profile.currentJob}</p>
                {profile.currentJobLocation && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.currentJobLocation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Match score */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Insights</h3>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-400 mt-0.5">Match</p>
              </div>
              <div className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-400 mt-0.5">Applied</p>
              </div>
            </div>
            <Button className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm gap-2">
              <ThumbsUp className="w-4 h-4" />
              Recommend Candidate
            </Button>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: <MessageCircle className="w-4 h-4 text-gray-400" />, label: "Send Message" },
                { icon: <Calendar className="w-4 h-4 text-gray-400" />, label: "Schedule Interview" },
                { icon: <FileText className="w-4 h-4 text-gray-400" />, label: "Download Resume" },
                { icon: <Eye className="w-4 h-4 text-gray-400" />, label: "View Portfolio" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left border border-transparent hover:border-gray-100"
                >
                  {icon}
                  {label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}