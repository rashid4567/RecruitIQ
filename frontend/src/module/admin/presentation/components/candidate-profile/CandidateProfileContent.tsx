
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Code,
  Award,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Candidate } from "../../../domain/entities/candidates.entity";

interface CandidateProfileContentProps {
  profile: Candidate;
}

export function CandidateProfileContent({ profile }: CandidateProfileContentProps) {
  const getExperienceYears = (exp: any): number => {
    if (exp == null) return 0;
    if (typeof exp === "number") return Math.max(0, exp);

    if (typeof exp === "object" && exp !== null) {
      if (typeof exp.value === "number") return Math.max(0, exp.value);
      if (typeof exp.years === "number") return Math.max(0, exp.years);
      if (typeof exp.experienceYears === "number") return Math.max(0, exp.experienceYears);
      if (typeof exp.total === "number") return Math.max(0, exp.total);
    }

    return 0;
  };

  const getExperienceDisplay = (exp: any): string => {
    const years = getExperienceYears(exp);
    if (years <= 0) return "Entry Level";
    if (years === 1) return "1 year";
    return `${years} years`;
  };

  const getInitials = (name?: string) =>
    name
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "NA";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden">
        <CardContent className="p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            <div className="relative shrink-0">
              <Avatar className="h-32 w-32 lg:h-40 lg:w-40 rounded-full border-4 border-white shadow-2xl">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                  alt={profile.name}
                />
                <AvatarFallback className="text-5xl bg-linear-to-br from-indigo-500 to-purple-600 text-white">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${
                  profile.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              >
                {profile.status === "Active" ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <Ban className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{profile.name}</h1>
                {profile.jobTitle && (
                  <p className="text-xl text-indigo-700 mt-2 font-medium flex items-center justify-center lg:justify-start gap-2">
                    <Briefcase className="w-5 h-5" />
                    {profile.jobTitle}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Experience</p>
                    <p className="font-medium">{getExperienceDisplay(profile.experience)}</p>
                  </div>
                </div>
              </div>

              {profile.summary && (
                <div className="pt-6 border-t border-gray-200/70">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-center lg:justify-start gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto lg:mx-0 whitespace-pre-wrap">
                    {profile.summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        {profile.skills?.length > 0 && (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden">
            <CardHeader className="bg-linear-to-r from-purple-50 to-violet-50 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-purple-900">
                <Code className="w-6 h-6 text-purple-600" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2.5">
                {profile.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    className="px-4 py-1.5 text-sm bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors rounded-full"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience Summary */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-blue-900">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-5 bg-white rounded-full shadow-sm border border-blue-100">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium uppercase tracking-wide">Total Experience</p>
                <p className="text-4xl font-bold text-blue-900 mt-2">
                  {getExperienceDisplay(profile.experience)}
                </p>
              </div>
              {profile.jobTitle && (
                <p className="text-lg text-gray-700 mt-2">
                  Current role: <span className="font-medium">{profile.jobTitle}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}