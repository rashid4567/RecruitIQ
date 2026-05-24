import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { Candidate } from "../../../domain/entities/candidates.entity";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getExperienceDisplay(years: number): string {
  if (years <= 0) return "Entry Level";
  if (years === 1) return "1 year";
  return `${years} years`;
}

function getExperienceLevel(years: number): { label: string; color: string } {
  if (years <= 2)
    return { label: "Junior", color: "bg-emerald-100 text-emerald-700" };
  if (years <= 5)
    return { label: "Mid-Level", color: "bg-blue-100 text-blue-700" };
  if (years <= 8)
    return { label: "Senior", color: "bg-purple-100 text-purple-700" };
  return { label: "Expert", color: "bg-amber-100 text-amber-700" };
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatTile({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center space-y-1">
      <div className="flex justify-center">{icon}</div>
      <p className="text-xs text-indigo-200 uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  );
}

function SectionCard({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="bg-linear-to-r from-indigo-50 to-purple-50 px-8 py-5 border-b">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
          <div className={`p-2 ${iconBg} rounded-xl`}>{icon}</div>
          {title}
        </CardTitle>
      </div>
      <CardContent className="px-8 py-7">{children}</CardContent>
    </Card>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CandidateProfileContentProps {
  profile: Candidate;
  /** Triggers the block confirmation dialog in the parent */
  onBlockClick?: () => void;
  /** Triggers the unblock confirmation dialog in the parent */
  onUnblockClick?: () => void;
  actionLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CandidateProfileContent({
  profile,
  onBlockClick,
  onUnblockClick,
  actionLoading = false,
}: CandidateProfileContentProps) {
  const isBlocked = profile.status === "Blocked";
  const experienceLevel = getExperienceLevel(profile.experienceYears);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-linear-to-r from-indigo-900 via-purple-900 to-violet-900 rounded-2xl">
        <div className="absolute inset-0 bg-black/20 rounded-2xl" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative px-6 sm:px-10 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            <div className="relative group shrink-0">
              <div className="absolute -inset-4 bg-linear-to-r from-indigo-400 to-purple-400 rounded-full opacity-60 group-hover:opacity-90 transition-opacity duration-300 blur-xl" />
              <Avatar className="h-36 w-36 lg:h-44 lg:w-44 rounded-full ring-4 ring-white/30 shadow-2xl relative">
                <AvatarFallback className="text-5xl bg-linear-to-br from-indigo-600 to-purple-600 text-white font-bold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>

              <div
                className={`absolute -bottom-3 -right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border-2 border-white ${
                  isBlocked ? "bg-red-500" : "bg-emerald-500"
                }`}
              >
                {isBlocked ? (
                  <Ban className="w-3.5 h-3.5 text-white" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                )}
                <span className="text-white text-xs font-semibold">
                  {isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            <div className="flex-1 w-full text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                      {profile.name}
                    </h2>
                    <Badge
                      className={`${experienceLevel.color} border-0 px-3 py-1.5 text-sm font-semibold`}
                    >
                      {experienceLevel.label}
                    </Badge>
                  </div>

                  {profile.currentJob && (
                    <div className="flex items-center gap-2 justify-center lg:justify-start text-indigo-200">
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <p className="text-lg">{profile.currentJob}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-indigo-200/80 text-sm">
                    {profile.currentJobLocation && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{profile.currentJobLocation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Available for opportunities</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-end shrink-0">
                  {profile.linkedinUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
                    >
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Linkedin className="mr-2 h-5 w-5" />
                        LinkedIn
                      </a>
                    </Button>
                  )}

                  {isBlocked ? (
                    <Button
                      onClick={onUnblockClick}
                      size="lg"
                      disabled={actionLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                    >
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      onClick={onBlockClick}
                      size="lg"
                      variant="destructive"
                      disabled={actionLoading}
                      className="shadow-lg"
                    >
                      <ShieldX className="mr-2 h-5 w-5" />
                      Block
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <StatTile
                  icon={<Mail className="w-5 h-5 text-indigo-300" />}
                  label="Email"
                >
                  <p className="text-white font-medium text-sm break-all">
                    {profile.email}
                  </p>
                </StatTile>

                <StatTile
                  icon={<Award className="w-5 h-5 text-indigo-300" />}
                  label="Experience"
                >
                  <p className="text-2xl font-bold text-white">
                    {getExperienceDisplay(profile.experienceYears)}
                  </p>
                </StatTile>

                {profile.educationLevel && (
                  <StatTile
                    icon={<GraduationCap className="w-5 h-5 text-indigo-300" />}
                    label="Education"
                  >
                    <p className="text-white font-medium text-sm">
                      {profile.educationLevel}
                    </p>
                  </StatTile>
                )}

                {profile.currentJobLocation && (
                  <StatTile
                    icon={<MapPin className="w-5 h-5 text-indigo-300" />}
                    label="Location"
                  >
                    <p className="text-white font-medium text-sm">
                      {profile.currentJobLocation}
                    </p>
                  </StatTile>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — About + Skills */}
        <div className="lg:col-span-2 space-y-8">
          {profile.bio && (
            <SectionCard
              icon={<FileText className="w-5 h-5 text-indigo-600" />}
              iconBg="bg-indigo-100"
              title="About"
            >
              <p className="text-gray-700 text-base leading-relaxed">
                {profile.bio}
              </p>
            </SectionCard>
          )}

          {profile.skills.length > 0 && (
            <SectionCard
              icon={<Code className="w-5 h-5 text-purple-600" />}
              iconBg="bg-purple-100"
              title="Technical Skills"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.skills.map((skill, i) => (
                  <div key={i} className="group">
                    <Badge className="w-full px-4 py-2.5 bg-linear-to-r from-indigo-50 to-purple-50 text-gray-700 hover:from-indigo-100 hover:to-purple-100 border-0 text-sm font-medium transition-all cursor-default justify-between">
                      {skill}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Badge>
                  </div>
                ))}
              </div>

              {profile.skills.length >= 3 && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Top Skills
                    </p>
                    <p className="text-sm text-amber-700 mt-0.5">
                      {profile.skills.slice(0, 3).join(", ")} are among the most
                      in-demand skills this year
                    </p>
                  </div>
                </div>
              )}
            </SectionCard>
          )}
        </div>

        <div className="space-y-8">
          {/* Experience */}
          <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
            <div className="bg-linear-to-r from-amber-50 to-orange-50 px-6 py-5 border-b">
              <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                Experience
              </CardTitle>
            </div>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <p className="text-4xl font-bold text-gray-900">
                  {getExperienceDisplay(profile.experienceYears)}
                </p>
                <Zap className="w-5 h-5 text-amber-500 absolute -top-2 -right-6" />
              </div>
              <p className="text-gray-500 text-sm mt-1">Total Experience</p>

              {profile.currentJob && (
                <div className="mt-5 pt-5 border-t">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Current Role
                  </p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {profile.currentJob}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white rounded-2xl">
            <CardHeader className="bg-linear-to-r from-slate-50 to-gray-50 rounded-t-2xl">
              <CardTitle className="text-lg text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5">
              {[
                {
                  icon: <MessageCircle className="h-4 w-4" />,
                  label: "Send Message",
                },
                {
                  icon: <Calendar className="h-4 w-4" />,
                  label: "Schedule Interview",
                },
                {
                  icon: <FileText className="h-4 w-4" />,
                  label: "Download Resume",
                },
                { icon: <Eye className="h-4 w-4" />, label: "View Portfolio" },
              ].map(({ icon, label }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  size="lg"
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-center gap-10 mb-5">
                <div className="text-center">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-xs opacity-80 mt-0.5">Match Score</p>
                </div>
                <div className="w-px bg-white/30" />
                <div className="text-center">
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs opacity-80 mt-0.5">Applications</p>
                </div>
              </div>
              <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Recommend Candidate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
