"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  Download,
  Mail,
  MapPin,
  Briefcase,

  FileText,
  Code,
  Award,
  Users,
  MessageSquare,
  Zap,
  Loader2,
  Ban,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { getCandidateProfileUC } from "@/module/admin/presentation/di/candidate.di";
import { Candidate } from "@/module/admin/domain/entities/candidates.entity";
import { toast } from "sonner";
import { blockUserUC, unblockUserUC } from "../di/user.di";

const CandidateProfileView: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);

  useEffect(() => {
    if (candidateId) fetchCandidateProfile(candidateId);
  }, [candidateId]);

  const fetchCandidateProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCandidateProfileUC.execute(id);
      console.log("Fetched profile:", data); 
      setProfile(data);
    } catch (err: any) {
      const msg = err?.message || "Failed to load candidate profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCandidate = async () => {
    if (!candidateId || !profile) return;
    try {
      setActionLoading(true);
      await blockUserUC.execute(candidateId);
      setProfile((prev) => prev ? prev.withStatus("Blocked") : null);
      toast.success("Candidate blocked", {
        description: `${profile.name} can no longer access the platform.`,
        icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      });
      setBlockDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to block candidate");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockCandidate = async () => {
    if (!candidateId || !profile) return;
    try {
      setActionLoading(true);
      await unblockUserUC.execute(candidateId);
      setProfile((prev) => prev ? prev.withStatus("Active") : null);
      toast.success("Candidate unblocked", {
        description: `${profile.name} can now access the platform.`,
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      });
      setUnblockDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to unblock candidate");
    } finally {
      setActionLoading(false);
    }
  };


  const getExperienceYears = (exp: any): number => {

    console.log("getExperienceYears received:", exp, "type:", typeof exp);

    if (exp == null) return 0;
    if (typeof exp === "number") return Math.max(0, exp);

    if (typeof exp === "object" && exp !== null) {
      if (typeof exp.value === "number") return Math.max(0, exp.value);
      if (typeof exp.years === "number") return Math.max(0, exp.years);
      if (typeof exp.experienceYears === "number") return Math.max(0, exp.experienceYears);
      if (typeof exp.total === "number") return Math.max(0, exp.total);
    }

    console.warn("Could not parse experience value:", exp);
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
            <p className="text-lg font-medium text-indigo-700">Loading candidate profile...</p>
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
                {error || "The candidate profile could not be found or may have been removed."}
              </p>
              <Button
                onClick={() => (error ? fetchCandidateProfile(candidateId!) : navigate("/admin/candidates"))}
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
        {/* ──────────────── Header ──────────────── */}
        <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 px-4 sm:px-8 py-5 sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/candidates")}
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
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchCandidateProfile(candidateId!)}>
                <Zap className="w-4 h-4" />
                Refresh
              </Button>

              {profile.status === "Active" ? (
                <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Ban className="w-4 h-4" />
                      Block
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md rounded-2xl">
                    <AlertDialogHeader>
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-rose-50 rounded-full">
                          <ShieldAlert className="w-10 h-10 text-rose-600" />
                        </div>
                      </div>
                      <AlertDialogTitle className="text-center text-xl">Block Candidate?</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        <span className="font-medium">{profile.name}</span> will lose access to the platform.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 sm:gap-4">
                      <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBlockCandidate}
                        disabled={actionLoading}
                        className="flex-1 bg-rose-600 hover:bg-rose-700"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Ban className="w-4 h-4 mr-2" />
                        )}
                        Block
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog open={unblockDialogOpen} onOpenChange={setUnblockDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" size="sm">
                      <ShieldCheck className="w-4 h-4" />
                      Unblock
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md rounded-2xl">
                    <AlertDialogHeader>
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-emerald-50 rounded-full">
                          <ShieldCheck className="w-10 h-10 text-emerald-600" />
                        </div>
                      </div>
                      <AlertDialogTitle className="text-center text-xl">Unblock Candidate?</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        Restore access for <span className="font-medium">{profile.name}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 sm:gap-4">
                      <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnblockCandidate}
                        disabled={actionLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Unblock
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </header>

        {/* ──────────────── Main Content ──────────────── */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-lg rounded-3xl overflow-hidden">
              <CardContent className="p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                  
                  <div className="relative shrink-0">
                    <Avatar className="h-32 w-32 lg:h-40 lg:w-40 rounded-full border-4 border-white shadow-2xl">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt={profile.name} />
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

                  {/* Info */}
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
        </main>
      </div>
    </div>
  );
};

export default CandidateProfileView;